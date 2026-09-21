import { test } from 'node:test';
import assert from 'node:assert/strict';
import { freshProgress, parseProgress, readProgress, saveProgress } from '../src/lib/storage/progress.ts';
import { indicators, groups } from '../src/data/kzi-methodology.example.ts';

test('16 unique indicators belong to four groups and have evidence', () => {
  assert.equal(indicators.length, 16);
  assert.equal(new Set(indicators.map(q => q.id)).size, 16);
  assert.equal(groups.length, 4);
  for (const q of indicators) {
    assert.ok(groups.some(g => g.id === q.groupId));
    assert.ok(q.evidence.length > 0);
  }
});
test('restores answers including unknown and current step without changing them', () => {
  const state = { ...freshProgress(), currentStep: 2, answers: { [indicators[0].id]: 'unknown', [indicators[1].id]: 'no' } };
  assert.deepEqual(parseProgress(JSON.stringify(state)), { progress: state, notice: null });
});
test('rejects another methodology version without reusing answers', () => {
  const result = parseProgress(JSON.stringify({ ...freshProgress(), methodologyVersion: 'old', answers: { [indicators[0].id]: 'yes' } }));
  assert.equal(result.notice, 'resetVersion');
  assert.deepEqual(result.progress.answers, {});
});
test('invalid values, corrupt JSON, skipped questions and fake completion are rejected', () => {
  for (const raw of ['{', 'null', JSON.stringify({...freshProgress(), currentStep: -1}), JSON.stringify({...freshProgress(), currentStep: 16}), JSON.stringify({...freshProgress(), currentStep: 5}), JSON.stringify({...freshProgress(), completed: true}), JSON.stringify({...freshProgress(), answers: {bogus: 'yes'}}), JSON.stringify({...freshProgress(), answers: {[indicators[0].id]: 'maybe'}})]) {
    assert.equal(parseProgress(raw).notice, 'invalidStorage');
  }
});
test('complete answers can be restored and revisited from any step', () => {
  const state = {...freshProgress(), currentStep: 15, completed: true, answers: Object.fromEntries(indicators.map(q => [q.id, 'unknown']))};
  assert.deepEqual(parseProgress(JSON.stringify(state)).progress, state);
});
test('unavailable storage does not throw and reports a save failure', () => {
  globalThis.window = { get localStorage() { throw new Error('Storage blocked'); } };
  assert.equal(readProgress().notice, 'saveError');
  assert.equal(saveProgress(freshProgress()), false);
  delete globalThis.window;
});
