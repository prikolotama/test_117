import test from 'node:test';
import assert from 'node:assert/strict';
import { liveScore } from '../src/lib/kzi/liveScore.ts';
import { calculateKzi } from '../src/lib/kzi/calculateKzi.ts';
import { methodology } from '../src/data/kzi-scoring.example.ts';
test('empty progress is distinct from sixteen negative answers', () => {
  const r = liveScore(methodology, {});
  assert.equal(r.totalScore, 0);
  assert.deepEqual(r.counts, {yes:0,no:0,unknown:0,unanswered:16});
  assert.ok(r.groupScores.every(g => g.completed === 0));
});
test('live score updates on edits and separates unknown and unanswered', () => {
  const [a,b,c] = methodology.indicators;
  const answers = {[a.id]:'yes', [b.id]:'no', [c.id]:'unknown'};
  const r = liveScore(methodology, answers);
  assert.equal(r.totalScore,.03);
  assert.deepEqual(r.counts,{yes:1,no:1,unknown:1,unanswered:13});
  assert.equal(r.groupScores[0].completed,3);
  assert.equal(liveScore(methodology,{...answers,[b.id]:'yes'}).totalScore,.07);
  assert.equal(liveScore(methodology,{...answers,[a.id]:'unknown'}).totalScore,0);
});
test('completed live score matches final base calculation', () => {
  const answers = Object.fromEntries(methodology.indicators.map((q,i) => [q.id, i%3===0 ? 'yes' : i%3===1 ? 'no' : 'unknown']));
  assert.equal(liveScore(methodology,answers).totalScore,calculateKzi(methodology,answers).totalScore);
  assert.equal(liveScore(methodology,answers).counts.unanswered,0);
});
