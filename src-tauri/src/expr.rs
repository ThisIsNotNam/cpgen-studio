use std::collections::HashMap;
#[derive(Debug, Clone, PartialEq)]
pub enum Op {
    Add,
    Sub,
    Mul,
    Div,
}

impl Op {
    pub fn as_str(&self) -> &str {
        match self {
            Op::Add => "+",
            Op::Sub => "-",
            Op::Div => "/",
            Op::Mul => "*",
        }
    }
}

impl TryFrom<Token> for Op {
    type Error = String;
    fn try_from(value: Token) -> Result<Self, Self::Error> {
        match value {
            Token::Plus => Ok(Op::Add),
            Token::Minus => Ok(Op::Sub),
            Token::Star => Ok(Op::Mul),
            Token::Slash => Ok(Op::Div),
            other => Err(format!("Unexpected operator: {:?}", other)),
        }
    }
}

#[derive(Debug, PartialEq)]
pub enum Expr {
    Number(f64),
    Variable(String),
    BinaryOp {
        left: Box<Expr>,
        op: Op,
        right: Box<Expr>,
    },
}

#[derive(Debug, PartialEq, Clone)]
#[allow(clippy::upper_case_acronyms)]
pub enum Token {
    Number(f64),
    Ident(String),
    Plus,
    Minus,
    Star,
    Slash,
    LParen,
    RParen,
    EOF,
}

impl TryFrom<&str> for Token {
    type Error = String;
    fn try_from(value: &str) -> Result<Self, Self::Error> {
        let is_ident = |s: &str| {
            let mut chars = s.chars();
            matches! (chars.next(), Some(c) if c.is_alphabetic() || c == '_')
                && chars.all(|c| c.is_alphanumeric() || c == '_')
        };

        match value {
            "+" => Ok(Token::Plus),
            "-" => Ok(Token::Minus),
            "*" => Ok(Token::Star),
            "/" => Ok(Token::Slash),
            "(" => Ok(Token::LParen),
            ")" => Ok(Token::RParen),
            "EOF" => Ok(Token::EOF),
            _ => {
                if is_ident(value) {
                    Ok(Token::Ident(value.to_string()))
                } else if let Ok(num) = value.parse::<f64>() {
                    Ok(Token::Number(num))
                } else {
                    Err(format!("Unknown token: '{value}'"))
                }
            }
        }
    }
}

pub struct Parser {
    tokens: Vec<Token>,
    cur: usize,
}

impl Parser {
    pub fn new(tokens: Vec<Token>) -> Self {
        Self { tokens, cur: 0 }
    }

    fn peek(&self) -> &Token {
        if self.cur >= self.tokens.len() {
            return &Token::EOF;
        }
        &self.tokens[self.cur]
    }

    fn _look_ahead(&self, count: usize) -> &Token {
        if self.cur + count >= self.tokens.len() {
            return &Token::EOF;
        }
        &self.tokens[self.cur + count]
    }

    fn consume(&mut self) -> Token {
        if self.cur >= self.tokens.len() {
            return Token::EOF;
        }
        self.cur += 1;
        self.tokens[self.cur - 1].clone()
    }

    fn parse_add(&mut self) -> Result<Expr, String> {
        let mut left = self.parse_mul()?;
        while matches!(self.peek(), Token::Plus | Token::Minus) {
            let op = self.consume();
            let right = self.parse_mul()?;
            left = Expr::BinaryOp {
                left: Box::new(left),
                op: Op::try_from(op)?,
                right: Box::new(right),
            };
        }
        Ok(left)
    }

    fn parse_mul(&mut self) -> Result<Expr, String> {
        let mut left = self.parse_primary()?;
        while matches!(self.peek(), Token::Star | Token::Slash) {
            let op = self.consume();
            let right = self.parse_primary()?;
            left = Expr::BinaryOp {
                left: Box::new(left),
                op: Op::try_from(op)?,
                right: Box::new(right),
            };
        }
        Ok(left)
    }

    fn parse_primary(&mut self) -> Result<Expr, String> {
        match self.peek() {
            &Token::Plus => {
                self.consume();
                self.parse_primary()
            }
            &Token::Minus => {
                self.consume();
                Ok(Expr::BinaryOp {
                    left: Box::new(Expr::Number(0f64)),
                    op: Op::Sub,
                    right: Box::new(self.parse_primary()?),
                })
            }
            &Token::LParen => {
                self.consume();
                let expr = self.parse_add()?;
                if self.consume() != Token::RParen {
                    return Err("Expected matching ')'".to_string());
                }
                Ok(expr)
            }
            &Token::Number(num) => {
                let value = num;
                self.consume();
                Ok(Expr::Number(value))
            }
            Token::Ident(var) => {
                let name = var.to_owned();
                self.consume();
                Ok(Expr::Variable(name))
            }
            other => Err(format!("Unexpected token: {:?}", other)),
        }
    }

    pub fn parse(&mut self) -> Result<Expr, String> {
        let ast = self.parse_add()?;
        if matches!(self.peek(), Token::EOF) {
            return Ok(ast);
        }
        Err(format!("Unexpected token: {:?}", self.peek()))
    }
}

impl Expr {
    pub fn eval(&self, env: &HashMap<String, f64>) -> Result<f64, String> {
        match self {
            Expr::Number(val) => Ok(*val),
            Expr::Variable(name) => match env.get(name) {
                Some(val) => Ok(*val),
                None => Err(format!("Unknown variable name: {name}")),
            },
            Expr::BinaryOp { left, op, right } => {
                let left_val = left.eval(env)?;
                let right_val = right.eval(env)?;
                match op.as_str() {
                    "+" => Ok(left_val + right_val),
                    "-" => Ok(left_val - right_val),
                    "*" => Ok(left_val * right_val),
                    "/" => Ok(left_val / right_val),
                    _ => Err(format!("Unexpected operator: {:?}", op)),
                }
            }
        }
    }
}

pub fn tokenize(inp: &str) -> Result<Vec<Token>, String> {
    let mut tokens: Vec<Token> = Vec::new();
    let mut cur = String::new();
    let mut has_decimal = false;
    for c in inp.trim().chars() {
        if c.is_alphanumeric() || c == '_' {
            cur.push(c);
        } else if c == '.' && !has_decimal {
            cur.push(c);
            has_decimal = true;
        } else {
            has_decimal = false;
            if !cur.is_empty() {
                tokens.push(Token::try_from(cur.as_str())?);
                cur.clear();
            }
            if !c.is_whitespace() {
                tokens.push(Token::try_from(c.to_string().as_str())?);
            }
        }
    }
    if !cur.is_empty() {
        tokens.push(Token::try_from(cur.as_str())?);
    }
    Ok(tokens)
}
