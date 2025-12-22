import { useLocalStorage } from './useLocalStorage';
import { AISettings } from '@/types/exam';

const STORAGE_KEY = 'ai-settings';

const defaultSettings: AISettings = {
  apiKey: '',
  model: 'gpt-4o-mini',
};

export function useAISettings() {
  const [settings, setSettings] = useLocalStorage<AISettings>(STORAGE_KEY, defaultSettings);

  const updateApiKey = (apiKey: string) => {
    setSettings((prev) => ({ ...prev, apiKey }));
  };

  const updateModel = (model: string) => {
    setSettings((prev) => ({ ...prev, model }));
  };

  const isConfigured = settings.apiKey.length > 0;

  return {
    settings,
    updateApiKey,
    updateModel,
    isConfigured,
  };
}
