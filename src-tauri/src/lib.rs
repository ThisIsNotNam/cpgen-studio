mod expr;
mod runner;
mod schema;
use serde::Serialize;
use std::{
    path::{Path, PathBuf},
    time::Duration,
};
use tauri::{AppHandle, Emitter, Manager};
use tauri_plugin_dialog::DialogExt;
use tokio::fs;

use crate::runner::prep_executable;

#[derive(Serialize)]
struct WorkspaceFilePayload {
    path: String,
    name: String,
    language: String,
    value: String,
}

fn infer_language(path: &Path) -> String {
    match path.extension().and_then(|extension| extension.to_str()) {
        Some("py") => "python",
        Some("cpp") | Some("cc") | Some("cxx") | Some("hpp") | Some("h") => "cpp",
        Some("ts") | Some("tsx") => "typescript",
        Some("js") | Some("jsx") => "javascript",
        Some("json") => "json",
        Some("md") => "markdown",
        _ => "plaintext",
    }
    .to_string()
}

fn build_workspace_file(path: PathBuf) -> Result<WorkspaceFilePayload, String> {
    let value = std::fs::read_to_string(&path)
        .map_err(|error| format!("failed to read {}: {}", path.display(), error))?;
    let name = path
        .file_name()
        .and_then(|file_name| file_name.to_str())
        .map(|file_name| file_name.to_string())
        .unwrap_or_else(|| path.display().to_string());

    Ok(WorkspaceFilePayload {
        path: path.display().to_string(),
        name,
        language: infer_language(&path),
        value,
    })
}

#[tauri::command]
async fn save_workspace_file(path: String, content: String) -> Result<(), String> {
    fs::write(&path, content)
        .await
        .map_err(|error| format!("failed to save {path}: {error}"))
}

#[tauri::command(async)]
fn read_workspace_file(path: String) -> Result<WorkspaceFilePayload, String> {
    build_workspace_file(PathBuf::from(path))
}

#[tauri::command]
fn pick_workspace_file(app: tauri::AppHandle) -> Result<Option<WorkspaceFilePayload>, String> {
    match app.dialog().file().blocking_pick_file() {
        Some(file_path) => {
            let path = file_path
                .into_path()
                .map_err(|error| format!("failed to resolve selected file: {}", error))?;
            build_workspace_file(path).map(Some)
        }
        None => Ok(None),
    }
}

#[tauri::command]
fn pick_directory(app: tauri::AppHandle) -> Result<Option<String>, String> {
    match app.dialog().file().blocking_pick_folder() {
        Some(file_path) => {
            let path = file_path
                .into_path()
                .map_err(|error| format!("failed to resolve selected directory: {}", error))?;
            Ok(Some(path.to_string_lossy().to_string()))
        }
        None => Ok(None),
    }
}

#[tauri::command]
fn show_window(window: tauri::Window) {
    let win = window
        .get_webview_window("main")
        .expect("main window not found — check window label in tauri.conf.json");
    win.show().expect("failed to show main window");
}

#[derive(Serialize, Clone)]
struct StatusPayload {
    step: String,
    message: String,
}

#[tauri::command]
async fn generate_tests(
    app: AppHandle,
    gen_path: PathBuf,
    sol_path: PathBuf,
    output_path: PathBuf,
    test_name: String,
    test_count: i32,
    index_as_arg: bool,
) -> Result<(), String> {
    let send_status = |step: &str, message: &str| {
        let _ = app.emit(
            "test-status",
            StatusPayload {
                step: step.to_string(),
                message: message.to_string(),
            },
        );
    };

    send_status(
        "prep_executable",
        "Preparing run command for provided files",
    );
    let gen_command = prep_executable(&gen_path).await?;
    let sol_command = prep_executable(&sol_path).await?;

    for i in 1..=test_count {
        let idx_str = i.to_string();
        send_status("run_executable", format!("Generating test #{i}").as_str());
        let test = if index_as_arg {
            let mut gen_command_with_idx = gen_command.clone();
            gen_command_with_idx.1.push(idx_str);
            runner::run(&gen_command_with_idx, Duration::from_secs(10), None).await?
        } else {
            runner::run(&gen_command, Duration::from_secs(10), Some(&idx_str)).await?
        };
        let result = runner::run(&sol_command, Duration::from_secs(10), Some(&test)).await?;
        let test_path = output_path.join(format!("{test_name}{i}"));
        fs::create_dir_all(&test_path)
            .await
            .map_err(|e| format!("Unable to create test output directory: {e}"))?;
        fs::write(test_path.join(format!("{test_name}.inp")), test)
            .await
            .map_err(|e| format!("Unable to write test: {e}"))?;
        fs::write(test_path.join(format!("{test_name}.out")), result)
            .await
            .map_err(|e| format!("Unable to write result: {e}"))?;
    }
    send_status(
        "finished",
        format!("Finished generating {test_count} tests.").as_str(),
    );
    Ok(())
}

#[tauri::command]
async fn generate_tests_from_schema(
    app: AppHandle,
    schema: Vec<schema::SchemaNode>,
    sol_path: PathBuf,
    output_path: PathBuf,
    test_name: String,
    test_count: i32,
    seed: Option<u64>,
) -> Result<(), String> {
    let send_status = |step: &str, message: &str| {
        let _ = app.emit(
            "test-status",
            StatusPayload {
                step: step.to_string(),
                message: message.to_string(),
            },
        );
    };

    send_status("prep_executable", "Preparing run command for solution file");
    let sol_command = prep_executable(&sol_path).await?;

    for i in 1..=test_count {
        send_status(
            "generate_input",
            format!("Generating test #{i} from schema").as_str(),
        );
        let test_seed = seed.map(|s| s.wrapping_add(i as u64));
        let test = schema::generate(&schema, test_seed)
            .map_err(|e| format!("Schema interpretation failed: {e}"))?;

        send_status(
            "run_executable",
            format!("Running solution for test #{i}").as_str(),
        );
        let result = runner::run(&sol_command, Duration::from_secs(10), Some(&test)).await?;

        let test_path = output_path.join(format!("{test_name}{i}"));
        fs::create_dir_all(&test_path)
            .await
            .map_err(|e| format!("Unable to create test output directory: {e}"))?;
        fs::write(test_path.join(format!("{test_name}.inp")), &test)
            .await
            .map_err(|e| format!("Unable to write test: {e}"))?;
        fs::write(test_path.join(format!("{test_name}.out")), result)
            .await
            .map_err(|e| format!("Unable to write result: {e}"))?;
    }

    send_status(
        "finished",
        format!("Finished generating {test_count} tests.").as_str(),
    );
    Ok(())
}

#[tauri::command(async)]
fn preview_schema(schema: Vec<schema::SchemaNode>, seed: Option<u64>) -> Result<String, String> {
    schema::generate(&schema, seed)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_window_state::Builder::default().build())
        .invoke_handler(tauri::generate_handler![
            read_workspace_file,
            pick_workspace_file,
            show_window,
            pick_directory,
            generate_tests,
            generate_tests_from_schema,
            preview_schema,
            save_workspace_file
        ])
        .setup(|app| {
            let handle = app.handle().clone();
            std::thread::spawn(move || {
                std::thread::sleep(std::time::Duration::from_secs(3));
                if let Some(win) = handle.get_webview_window("main") {
                    if !win.is_visible().unwrap_or(false) {
                        let _ = win.show();
                        handle
                            .dialog()
                            .message("The app took longer than expected to load.")
                            .title("Startup warning")
                            .blocking_show();
                    }
                }
            });
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
