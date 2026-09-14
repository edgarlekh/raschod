import React from 'react';
import { render } from '@testing-library/react-native';
import { ThemeProvider } from '../ThemeProvider';
import { GoalProgressBar } from './GoalProgressBar';

function renderBar(percent: number) {
  return render(
    <ThemeProvider scheme="dark">
      <GoalProgressBar percent={percent} />
    </ThemeProvider>,
  );
}

describe('GoalProgressBar', () => {
  it('sets the fill width to the given percent', async () => {
    const { getByTestId } = await renderBar(62);
    const fill = getByTestId('goal-progress-fill');
    expect(fill.props.style).toEqual(expect.objectContaining({ width: '62%' }));
  });

  it('clamps a percent above 100 to 100', async () => {
    const { getByTestId } = await renderBar(140);
    expect(getByTestId('goal-progress-fill').props.style).toEqual(expect.objectContaining({ width: '100%' }));
  });

  it('clamps a negative percent to 0', async () => {
    const { getByTestId } = await renderBar(-10);
    expect(getByTestId('goal-progress-fill').props.style).toEqual(expect.objectContaining({ width: '0%' }));
  });
});
