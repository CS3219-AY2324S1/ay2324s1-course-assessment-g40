const MatchingQueue = require('../models/matching-queue');
const Match = require('../models/match.object');

describe('MatchingQueue', () => {
  let queue;

  beforeEach(() => {
    queue = new MatchingQueue();
  });

  describe('enqueue function', () => {
    it('should add a match to the queue', () => {
      const match = new Match("User", "Hard", "Python", null);
      queue.enqueue(match);
      expect(queue.getQueueLen()).toEqual(1);
    });

    it('should return undefined if the user already exists in the queue', () => {
      const match = new Match("User", "Hard", "Python", null);
      const match2 = new Match("User", "Easy", "Java", null);
      queue.enqueue(match);
      const result = queue.enqueue(match2);
      expect(result).toBeUndefined();
    });
  });

  describe('deleteMatch function', () => {
    it('should remove a match from the queue', () => {
      const match = new Match("User", "Hard", "Python", null);
      queue.enqueue(match);
      queue.deleteMatch("User");
      expect(queue.getQueueLen()).toEqual(0);
    });
  });

  describe('checkMatch function', () => {
    it('should return the matching match if it exists in the queue', () => {
      const match1 = new Match("User1", "Hard", "Python", null);
      const match2 = new Match("User2", "Hard", "Python", null);
      queue.enqueue(match1);
      const result = queue.checkMatch(match2);
      expect(result).toEqual(match1);
    });

    it('should return undefined if the match does not exist in the queue', () => {
      const match = { userid: 1, name: 'John' };
      const result = queue.checkMatch(match);
      expect(result).toBeUndefined();
    });
  });

  describe('checkUserId function', () => {
    it('should return the matching match if it exists in the queue', () => {
      const match = new Match("User1", "Hard", "Python", null);
      queue.enqueue(match);
      const result = queue.checkUserId("User1");
      expect(result).toEqual(match);
    });

    it('should return undefined if the match does not exist in the queue', () => {
      const result = queue.checkUserId(1);
      expect(result).toBeUndefined();
    });
  });

  describe('getQueueLen function', () => {
    it('should return the length of the queue', () => {
      const match1 = new Match("User1", "Hard", "Python", null);
      const match2 = new Match("User2", "Easy", "Java", null);
      queue.enqueue(match1);
      queue.enqueue(match2);
      expect(queue.getQueueLen()).toEqual(2);
    });
  });
});