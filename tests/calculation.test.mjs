import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calculateKzi } from '../src/lib/kzi/calculateKzi.ts';
import { methodology } from '../src/data/kzi-scoring.example.ts';
import { requiredMeasures } from '../src/data/required-measures.ts';
const answers = (value) => Object.fromEntries(methodology.indicators.map(i => [i.id, value]));
test('all yes gives 1; group maxima add up to 1', () => {
  const result = calculateKzi(methodology, answers('yes'));
  assert.equal(result.totalScore, 1);
  assert.equal(result.maxScore, 1);
  assert.equal(result.completedCount, 16);
  assert.deepEqual(result.groupScores.map(g => g.score), [0.1,0.25,0.35,0.3]);
  assert.equal(result.failedIndicators.length, 0);
  assert.equal(result.unknownIndicators.length, 0);
});
test('no and unknown both add zero but remain separate', () => {
  assert.equal(calculateKzi(methodology, answers('no')).totalScore, 0);
  const unknown = calculateKzi(methodology, answers('unknown'));
  assert.equal(unknown.totalScore, 0);
  assert.equal(unknown.unknownIndicators.length, 16);
  assert.equal(unknown.failedIndicators.length, 0);
});
test('mixed answers use group weights and sort by impact', () => {
  const input = {...answers('yes'), 'k-4.1': 'no', 'k-1.1': 'unknown', 'k-3.2':'no'};
  const result = calculateKzi(methodology, input);
  assert.equal(result.totalScore, 0.7625);
  assert.deepEqual(result.failedIndicators.map(i => i.id), ['k-4.1','k-3.2']);
  assert.equal(result.unknownIndicators[0].id, 'k-1.1');
  assert.equal(result.unknownIndicators[0].impact, 0.03);
});
test('fractional contributions retain precision', () => {
  assert.equal(calculateKzi(methodology, {...answers('yes'),'k-3.3':'no'}).totalScore, 0.9475);
});
test('incomplete and invalid answers are rejected', () => {
  assert.throws(() => calculateKzi(methodology, {}));
  assert.throws(() => calculateKzi(methodology, {...answers('yes'),'k-1.1':'invalid'}));
  assert.throws(() => calculateKzi(methodology, {...answers('yes'),extra:'yes'}));
});
test('invalid or missing coefficients cannot silently produce a result', () => {
  assert.throws(() => calculateKzi({...methodology, groups: methodology.groups.map(g => ({...g,weight:NaN}))},answers('yes')));
  assert.throws(() => calculateKzi({...methodology, answerValues:{yes:1,no:0}},answers('yes')));
});
test('engine preserves input and supports explicit rule extensions', () => {
  const input = Object.freeze(answers('yes'));
  const before = JSON.stringify(methodology);
  const result = calculateKzi({...methodology, rules:[base => ({...base, totalScore:0,groupScores:base.groupScores.map(g => ({...g,score:0}))})]},input);
  assert.equal(result.totalScore,0);
  assert.equal(JSON.stringify(methodology),before);
});
test('hero contains exactly 21 distinct paragraph references', () => {
  assert.equal(requiredMeasures.items.length,21);
  assert.equal(new Set(requiredMeasures.items.map(i => i[0])).size,21);
});
