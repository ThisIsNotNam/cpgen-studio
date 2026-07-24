interface PathPickerProps {
  label: string;
  path: string;
  placeholder: string;
  onChange: (path: string) => void;
  onSubmit: (path: string) => void;
  onBrowse: () => void;
  onClear: () => void;
}

export default function PathPicker({
  label,
  path,
  placeholder,
  onChange,
  onSubmit,
  onBrowse,
  onClear,
}: PathPickerProps) {
  return (
    <div className="section">
      <div className="section-title">{label}</div>
      <div className="path-picker-row">
        <input
          className="path-picker-input"
          type="text"
          value={path}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              onSubmit(path);
            }
          }}
        />
        <button type="button" className="path-picker-button" onClick={onBrowse}>
          Browse
        </button>
        <button type="button" className="path-picker-clear" onClick={onClear}>
          Clear
        </button>
      </div>
    </div>
  );
}
