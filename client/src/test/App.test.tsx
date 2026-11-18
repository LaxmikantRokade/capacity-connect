import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../App';
import {
  extractYouTubeId,
  getYouTubeEmbedUrl,
  getYouTubeWatchUrl,
} from '../pages/InteractiveLearningPage';
import { INITIAL_COURSES } from '../data/mockData';

describe('Capacity Connect Frontend Application', () => {
  it('renders landing page brand and SIH26075 problem statement badge', () => {
    render(<App />);
    expect(screen.getAllByText(/Capacity/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/SIH26075/i)[0]).toBeInTheDocument();
  });

  it('renders interactive role sandbox buttons', () => {
    render(<App />);
    expect(screen.getByText(/Learner \/ Employee/i)).toBeInTheDocument();
    expect(screen.getByText(/Trainer \/ Instructor/i)).toBeInTheDocument();
    expect(screen.getByText(/Organization Manager/i)).toBeInTheDocument();
    expect(screen.getByText(/System Administrator/i)).toBeInTheDocument();
  });

  it('validates YouTube helper functions for watch, short, and embed formats', () => {
    const watchUrl = 'https://www.youtube.com/watch?v=miaLbP8VRFo';
    const shortUrl = 'https://youtu.be/IRSQEO0koYY';
    const embedUrl = 'https://www.youtube.com/embed/0M55onu7mVI';

    expect(extractYouTubeId(watchUrl)).toBe('miaLbP8VRFo');
    expect(extractYouTubeId(shortUrl)).toBe('IRSQEO0koYY');
    expect(extractYouTubeId(embedUrl)).toBe('0M55onu7mVI');

    expect(getYouTubeEmbedUrl(watchUrl)).toContain('https://www.youtube.com/embed/miaLbP8VRFo');
    expect(getYouTubeWatchUrl(embedUrl)).toBe('https://www.youtube.com/watch?v=0M55onu7mVI');
  });

  it('verifies all INITIAL_COURSES have valid modules and non-random videos', () => {
    expect(INITIAL_COURSES.length).toBeGreaterThanOrEqual(9);
    expect(INITIAL_COURSES.map((c) => c.id)).toEqual(
      expect.arrayContaining(['course-1', 'course-2', 'course-3', 'course-4', 'course-5', 'course-6', 'course-7', 'course-8', 'course-9'])
    );
    INITIAL_COURSES.forEach((c) => {
      expect(c.modules).toBeDefined();
      expect(c.modules!.length).toBeGreaterThanOrEqual(4);
      c.modules!.forEach((m) => {
        expect(m.title).toBeTruthy();
        expect(m.content).toBeTruthy();
        if (m.contentType === 'VIDEO') {
          expect(m.videoUrl).toBeDefined();
          expect(m.videoUrl).not.toContain('dQw4w9WgXcQ'); // Rickroll check
          expect(extractYouTubeId(m.videoUrl)).toHaveLength(11);
        }
      });
    });
  });
});
