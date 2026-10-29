import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../App';

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
});
