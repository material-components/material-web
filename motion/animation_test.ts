/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {AnimationSignal, createAnimationSignal} from './animation.js';

describe('createAnimationSignal()', () => {
  let task: AnimationSignal;

  beforeEach(() => {
    task = createAnimationSignal();
  });

  describe('start()', () => {
    it('should return an AbortSignal', () => {
      const signal = task.start();
      expect(signal).toBeInstanceOf(AbortSignal);
    });

    it('should abort previous signal on subsequent calls', () => {
      const firstSignal = task.start();
      expect(firstSignal.aborted)
          .withContext('first signal should not be aborted by default')
          .toBeFalse();
      const secondSignal = task.start();
      expect(firstSignal.aborted)
          .withContext('first signal should abort after start is called again')
          .toBeTrue();
      expect(secondSignal.aborted)
          .withContext('second signal should not be aborted by default')
          .toBeFalse();
    });
  });

  describe('finish()', () => {
    it('should not abort the AbortSignal', () => {
      const signal = task.start();
      task.finish();
      expect(signal.aborted)
          .withContext('finishing a task should not signal an abort')
          .toBeFalse();
    });

    it('should not abort previous tasks when starting after finishing', () => {
      const firstSignal = task.start();
      task.finish();
      task.start();
      expect(firstSignal.aborted)
          .withContext('starting a new task should not finished tasks')
          .toBeFalse();
    });
  });
});
