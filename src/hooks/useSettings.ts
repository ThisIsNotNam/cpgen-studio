import { Store } from "@tauri-apps/plugin-store";
import { useEffect, useRef, useState } from "react";
import type { SettingKey } from "../types";

interface SettingsState {
  fontSize: number;
  fontFamily: string;
}

const DEFAULT_SETTINGS: SettingsState = {
  fontSize: 13,
  fontFamily:
    '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
};

export function useSettings() {
  const [settings, setSettings] = useState<SettingsState>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const storePromiseRef = useRef<Promise<Store | null>>(null);

  useEffect(() => {
    const storePromise = Store.load("settings.json").catch((err) => {
      setError("Failed to load settings. Using defaults.");
      console.error("Failed to load settings store:", err);
      return null;
    });
    storePromiseRef.current = storePromise;
    let canceled = false;
    (async () => {
      const store = await storePromise;
      if (canceled) return;
      if (!store) {
        setIsLoaded(true);
        return;
      }
      const [fontSize, fontFamily] = await Promise.all([
        store.get<number>("fontSize"),
        store.get<string>("fontFamily"),
      ]);
      if (canceled) return;
      setSettings((prev) => ({
        fontSize: fontSize ?? prev.fontSize,
        fontFamily: fontFamily ?? prev.fontFamily,
      }));
      setIsLoaded(true);
    })();
    return () => {
      canceled = true;
    };
  }, []);

  const onSettingChange = async (key: SettingKey, value: number | string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setError(null);
    try {
      const store = await storePromiseRef.current;
      if (!store) {
        setError("Settings could not be saved.");
        return;
      }
      await store.set(key, value);
      await store.save();
    } catch (err) {
      console.error("Failed to save settings:", err);
      setError("Failed to save settings.");
    }
  };

  return { ...settings, isLoaded, onSettingChange, error, setError };
}
