import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ProcessingSettings } from '../types';

interface ProcessingOptionsProps {
  settings: ProcessingSettings;
  onSettingsChange: (settings: ProcessingSettings) => void;
  disabled?: boolean;
}

export default function ProcessingOptions({
  settings,
  onSettingsChange,
  disabled,
}: ProcessingOptionsProps) {
  const updateSetting = (key: keyof ProcessingSettings, value: any) => {
    onSettingsChange({
      ...settings,
      [key]: value,
    });
  };

  const SettingRow = ({
    title,
    subtitle,
    value,
    onValueChange,
    type = 'switch',
    options,
  }: {
    title: string;
    subtitle?: string;
    value: any;
    onValueChange: (value: any) => void;
    type?: 'switch' | 'select';
    options?: { label: string; value: any }[];
  }) => (
    <View style={styles.settingRow}>
      <View style={styles.settingInfo}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      
      {type === 'switch' ? (
        <Switch
          value={value}
          onValueChange={onValueChange}
          disabled={disabled}
          trackColor={{ false: '#3a3a3a', true: '#007AFF' }}
          thumbColor={value ? '#fff' : '#ccc'}
        />
      ) : (
        <View style={styles.selectContainer}>
          {options?.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.selectOption,
                value === option.value && styles.selectOptionActive,
                disabled && styles.selectOptionDisabled,
              ]}
              onPress={() => !disabled && onValueChange(option.value)}
              disabled={disabled}
            >
              <Text
                style={[
                  styles.selectOptionText,
                  value === option.value && styles.selectOptionTextActive,
                  disabled && styles.selectOptionTextDisabled,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="settings-outline" size={20} color="#fff" />
        <Text style={styles.title}>Processing Options</Text>
      </View>

      <SettingRow
        title="Colorize"
        subtitle="Apply AI colorization to manga images"
        value={settings.colorize}
        onValueChange={(value) => updateSetting('colorize', value)}
      />

      <SettingRow
        title="Upscale"
        subtitle="Enhance image resolution"
        value={settings.upscale}
        onValueChange={(value) => updateSetting('upscale', value)}
      />

      {settings.upscale && (
        <SettingRow
          title="Upscale Factor"
          subtitle="Image resolution multiplier"
          value={settings.upscaleFactor}
          onValueChange={(value) => updateSetting('upscaleFactor', value)}
          type="select"
          options={[
            { label: '2x', value: 2 },
            { label: '4x', value: 4 },
          ]}
        />
      )}

      <SettingRow
        title="Denoise"
        subtitle="Remove noise from images"
        value={settings.denoise}
        onValueChange={(value) => updateSetting('denoise', value)}
      />

      <SettingRow
        title="Cache Results"
        subtitle="Save processed images for faster access"
        value={settings.cache}
        onValueChange={(value) => updateSetting('cache', value)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 20,
    margin: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 8,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#3a3a3a',
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 12,
    color: '#ccc',
  },
  selectContainer: {
    flexDirection: 'row',
  },
  selectOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#3a3a3a',
    marginLeft: 8,
  },
  selectOptionActive: {
    backgroundColor: '#007AFF',
  },
  selectOptionDisabled: {
    backgroundColor: '#1a1a1a',
  },
  selectOptionText: {
    fontSize: 14,
    color: '#ccc',
    fontWeight: '600',
  },
  selectOptionTextActive: {
    color: '#fff',
  },
  selectOptionTextDisabled: {
    color: '#666',
  },
});

