import { usePipelineContext } from "../context/PipelineContext";

export default function ParametersForm() {
  const { config, onConfigChange } = usePipelineContext();

  return (
    <div className="section">
      <div className="section-title">Parameters</div>
      <div className="form-row compact">
        <label>Batches</label>
        <div className="input-wrap">
          <input
            type="number"
            value={config.batches}
            min={1}
            max={100}
            onChange={(event) =>
              onConfigChange("batches", Number(event.target.value) || 1)
            }
          />
        </div>
      </div>
      <div className="form-row compact">
        <label>Index</label>
        <div className="input-wrap">
          <div className="radio-group">
            <input
              type="radio"
              name="idx"
              id="idx-arg"
              checked={config.indexDelivery === "argv[1]"}
              onChange={() => onConfigChange("indexDelivery", "argv[1]")}
            />
            <label htmlFor="idx-arg">argv[1]</label>
            <input
              type="radio"
              name="idx"
              id="idx-stdin"
              checked={config.indexDelivery === "stdin"}
              onChange={() => onConfigChange("indexDelivery", "stdin")}
            />
            <label htmlFor="idx-stdin">stdin</label>
          </div>
        </div>
      </div>
    </div>
  );
}
