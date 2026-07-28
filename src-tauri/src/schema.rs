use crate::expr;
use rand::{rngs::StdRng, Rng, RngExt, SeedableRng};
use serde::Deserialize;
use std::collections::HashMap;

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum Charset {
    Lowercase,
    Uppercase,
    Alphanumeric,
    Digits,
    Custom,
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum Separator {
    Space,
    Newline,
    Comma,
}

#[derive(Debug, Clone, Deserialize)]
#[serde(tag = "kind", rename_all = "lowercase")]
pub enum PrimitiveSpec {
    Int {
        min: String,
        max: String,
    },
    Float {
        min: String,
        max: String,
        precision: String,
    },
    String {
        length: String,
        charset: Charset,
        #[serde(rename = "customCharset")]
        custom_charset: Option<String>,
    },
}

#[derive(Debug, Clone, Deserialize)]
#[serde(tag = "kind", rename_all = "lowercase")]
pub enum SchemaNode {
    Int {
        #[serde(rename = "varName")]
        var_name: Option<String>,
        min: String,
        max: String,
    },
    Float {
        #[serde(rename = "varName")]
        var_name: Option<String>,
        min: String,
        max: String,
        precision: String,
    },
    String {
        #[serde(rename = "varName")]
        var_name: Option<String>,
        length: String,
        charset: Charset,
        #[serde(rename = "customCharset")]
        custom_charset: Option<String>,
    },
    Array {
        #[serde(rename = "varName")]
        var_name: Option<String>,
        length: String,
        separator: Separator,
        element: PrimitiveSpec,
    },
    Loop {
        count: String,
        children: Vec<SchemaNode>,
    },
}

enum Value {
    Num(f64),
    Text,
}

struct Interpreter {
    rng: Box<dyn Rng>,
    vars: HashMap<String, Value>,
}

impl Interpreter {
    fn numeric_env(&self) -> HashMap<String, f64> {
        self.vars
            .iter()
            .filter_map(|(k, v)| match v {
                Value::Num(n) => Some((k.clone(), *n)),
                _ => None,
            })
            .collect()
    }

    fn resolve_number(&self, field: &str, raw: &str) -> Result<f64, String> {
        let tokens = expr::tokenize(raw).map_err(|e| format!("{field}: {e}"))?;
        let ast = expr::Parser::new(tokens)
            .parse()
            .map_err(|e: String| format!("{field}: {e}"))?;
        let value = ast
            .eval(&self.numeric_env())
            .map_err(|e| format!("{field}: {e}"))?;
        if !value.is_finite() {
            return Err(format!(
                "{field}: expression '{raw}' produced a non-finite result"
            ));
        }
        Ok(value)
    }

    fn resolve_int(&self, field: &str, raw: &str) -> Result<i64, String> {
        Ok(self.resolve_number(field, raw)?.round() as i64)
    }

    fn bind(&mut self, var_name: &Option<String>, value: Value) {
        if let Some(name) = var_name {
            if !name.is_empty() {
                self.vars.insert(name.clone(), value);
            }
        }
    }
}

impl Interpreter {
    fn gen_int(&mut self, min: &str, max: &str) -> Result<i64, String> {
        let lo = self.resolve_int("min", min)?;
        let hi = self.resolve_int("max", max)?;
        if lo > hi {
            return Err(format!("min ({lo}) is greater than max ({hi})"));
        }
        Ok(self.rng.random_range(lo..=hi))
    }

    fn gen_float(&mut self, min: &str, max: &str, precision: &str) -> Result<String, String> {
        let lo = self.resolve_number("min", min)?;
        let hi = self.resolve_number("max", max)?;
        if lo > hi {
            return Err(format!("min ({lo}) is greater than max ({hi})"));
        }
        let p = self.resolve_int("precision", precision)?.max(0) as usize;
        let v = self.rng.random_range(lo..=hi);
        Ok(format!("{:.*}", p, v))
    }

    fn gen_string(
        &mut self,
        length: &str,
        charset: &Charset,
        custom: &Option<String>,
    ) -> Result<String, String> {
        let len = self.resolve_int("length", length)?;
        if len < 0 {
            return Err(format!("length ({len}) cannot be negative"));
        }
        let alphabet: Vec<char> = match charset {
            Charset::Lowercase => ('a'..='z').collect(),
            Charset::Uppercase => ('A'..='Z').collect(),
            Charset::Alphanumeric => ('a'..='z').chain('A'..='Z').chain('0'..='9').collect(),
            Charset::Digits => ('0'..='9').collect(),
            Charset::Custom => custom.clone().unwrap_or_default().chars().collect(),
        };
        if alphabet.is_empty() {
            return Err("charset resolved to an empty character set".to_string());
        }
        Ok((0..len)
            .map(|_| alphabet[self.rng.random_range(0..alphabet.len())])
            .collect())
    }

    fn gen_primitive(&mut self, spec: &PrimitiveSpec) -> Result<String, String> {
        match spec {
            PrimitiveSpec::Int { min, max } => Ok(self.gen_int(min, max)?.to_string()),
            PrimitiveSpec::Float {
                min,
                max,
                precision,
            } => self.gen_float(min, max, precision),
            PrimitiveSpec::String {
                length,
                charset,
                custom_charset,
            } => self.gen_string(length, charset, custom_charset),
        }
    }
}

impl Interpreter {
    fn eval_nodes(&mut self, nodes: &[SchemaNode], out: &mut Vec<String>) -> Result<(), String> {
        for node in nodes {
            match node {
                SchemaNode::Int {
                    var_name, min, max, ..
                } => {
                    let v = self.gen_int(min, max)?;
                    self.bind(var_name, Value::Num(v as f64));
                    out.push(v.to_string());
                }
                SchemaNode::Float {
                    var_name,
                    min,
                    max,
                    precision,
                    ..
                } => {
                    let s = self.gen_float(min, max, precision)?;
                    let numeric: f64 = s
                        .parse()
                        .map_err(|_| "internal: bad float format".to_string())?;
                    self.bind(var_name, Value::Num(numeric));
                    out.push(s);
                }
                SchemaNode::String {
                    var_name,
                    length,
                    charset,
                    custom_charset,
                    ..
                } => {
                    let s = self.gen_string(length, charset, custom_charset)?;
                    self.bind(var_name, Value::Text);
                    out.push(s);
                }
                SchemaNode::Array {
                    var_name,
                    length,
                    separator,
                    element,
                    ..
                } => {
                    let n = self.resolve_int("length", length)?;
                    if n < 0 {
                        return Err(format!("array length ({n}) cannot be negative"));
                    }
                    let sep = match separator {
                        Separator::Space => " ",
                        Separator::Newline => "\n",
                        Separator::Comma => ",",
                    };
                    let mut items = Vec::with_capacity(n as usize);
                    for _ in 0..n {
                        items.push(self.gen_primitive(element)?);
                    }
                    let line = items.join(sep);
                    self.bind(var_name, Value::Text);
                    out.push(line);
                }
                SchemaNode::Loop {
                    count, children, ..
                } => {
                    let reps = self.resolve_int("count", count)?;
                    if reps < 0 {
                        return Err(format!("loop count ({reps}) cannot be negative"));
                    }
                    for _ in 0..reps {
                        self.eval_nodes(children, out)?;
                    }
                }
            }
        }
        Ok(())
    }
}

pub fn generate(nodes: &[SchemaNode], seed: Option<u64>) -> Result<String, String> {
    let rng: Box<dyn Rng> = match seed {
        Some(s) => Box::new(StdRng::seed_from_u64(s)),
        None => Box::new(rand::rng()),
    };
    let mut interp = Interpreter {
        rng,
        vars: HashMap::new(),
    };
    let mut lines = Vec::new();
    interp.eval_nodes(nodes, &mut lines)?;
    Ok(lines.join("\n"))
}
