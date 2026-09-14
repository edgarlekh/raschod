// app/_layout.tsx
import { useEffect } from 'react';
import '../global.css';
import { Stack } from 'expo-router';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { ThemeProvider } from '../src/design/ThemeProvider';
import { Screen } from '../src/design/components/Screen';
import { Text } from 'react-native';
import { db } from '../src/db/client';
import migrations from '../drizzle/migrations';
import { SqliteCategoryRepository } from '../src/data/sqlite/SqliteCategoryRepository';

const categoryRepository = new SqliteCategoryRepository(db);

export default function RootLayout() {
  const { success, error } = useMigrations(db, migrations);

  useEffect(() => {
    if (success) {
      categoryRepository.seedDefaultsIfEmpty();
    }
  }, [success]);

  if (error) {
    return (
      <ThemeProvider>
        <Screen>
          <Text>Ошибка миграции базы данных: {error.message}</Text>
        </Screen>
      </ThemeProvider>
    );
  }

  if (!success) {
    return null;
  }

  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="capture" options={{ presentation: 'modal' }} />
      </Stack>
    </ThemeProvider>
  );
}
