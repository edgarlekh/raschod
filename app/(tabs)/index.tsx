// app/(tabs)/index.tsx
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { db } from '../../src/db/client';
import { SqliteTransactionRepository } from '../../src/data/sqlite/SqliteTransactionRepository';
import { SqliteGoalRepository } from '../../src/data/sqlite/SqliteGoalRepository';
import { SqliteCategoryRepository } from '../../src/data/sqlite/SqliteCategoryRepository';
import { SqliteGamificationRepository } from '../../src/data/sqlite/SqliteGamificationRepository';
import { useHomeSummary } from '../../src/features/home/useHomeSummary';
import { Screen } from '../../src/design/components/Screen';
import { Card } from '../../src/design/components/Card';
import { AmountText } from '../../src/design/components/AmountText';
import { GoalProgressBar } from '../../src/design/components/GoalProgressBar';
import { useTheme } from '../../src/design/ThemeProvider';
import { money, formatMoney } from '../../src/lib/money';

// One repository instance per process, sharing the app-wide `db` singleton —
// matches how the route layer is expected to consume Plan 1's data layer
// (see the architecture note in docs/superpowers/specs/2026-09-14-raschod-design.md).
const transactionRepository = new SqliteTransactionRepository(db);
const goalRepository = new SqliteGoalRepository(db);
const categoryRepository = new SqliteCategoryRepository(db);
const gamificationRepository = new SqliteGamificationRepository(db);

export default function HomeScreen() {
  const theme = useTheme();
  const { data, loading, error } = useHomeSummary({
    transactionRepository,
    goalRepository,
    categoryRepository,
    gamificationRepository,
  });

  if (loading && !data) {
    return (
      <Screen>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={theme.colors.accent} />
        </View>
      </Screen>
    );
  }

  if (error || !data) {
    return (
      <Screen>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: theme.spacing.lg }}>
          <Text style={{ color: theme.colors.textSecondary }}>Не удалось загрузить данные</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: theme.spacing.md, gap: theme.spacing.md }}>
        <Card variant="elevated">
          <Text style={{ color: theme.colors.textSecondary, fontSize: theme.typography.caption.fontSize }}>
            Баланс
          </Text>
          <AmountText money={money(data.balanceMinor, data.currency)} style="display" />
        </Card>

        {data.goal ? (
          <Card>
            <Text
              style={{
                color: theme.colors.textPrimary,
                fontSize: theme.typography.h3.fontSize,
                fontWeight: theme.typography.h3.fontWeight,
                marginBottom: theme.spacing.sm,
              }}
            >
              {data.goal.name}
            </Text>
            <GoalProgressBar percent={data.goal.progress.percentComplete} />
            <Text
              style={{
                color: theme.colors.textSecondary,
                fontSize: theme.typography.caption.fontSize,
                marginTop: theme.spacing.xs,
              }}
            >
              {data.goal.progress.percentComplete}% · осталось{' '}
              {formatMoney(money(data.goal.progress.remainingMinor, data.goal.currency))}
            </Text>
          </Card>
        ) : (
          <Card>
            <Text style={{ color: theme.colors.textSecondary }}>Цель ещё не выбрана</Text>
          </Card>
        )}

        <Card>
          <Text style={{ color: theme.colors.textSecondary, fontSize: theme.typography.caption.fontSize }}>
            Сэкономлено трением
          </Text>
          <AmountText money={money(data.savedFromFrictionMinor, data.currency)} kind="income" style="bodyStrong" />
        </Card>

        <View>
          <Text
            style={{
              color: theme.colors.textPrimary,
              fontSize: theme.typography.h3.fontSize,
              fontWeight: theme.typography.h3.fontWeight,
              marginBottom: theme.spacing.sm,
            }}
          >
            Последние операции
          </Text>
          {data.recentTransactions.length === 0 ? (
            <Text style={{ color: theme.colors.textSecondary }}>Пока нет операций</Text>
          ) : (
            data.recentTransactions.map((t) => (
              <Card key={t.id}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ color: theme.colors.textPrimary }}>{t.categoryName}</Text>
                  <AmountText
                    money={money(t.amountMinor, t.currency)}
                    kind={t.type === 'income' ? 'income' : 'neutral'}
                    style="bodyStrong"
                  />
                </View>
              </Card>
            ))
          )}
        </View>
      </ScrollView>
    </Screen>
  );
}
