import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProductCard from '../components/products/ProductCard.jsx';
import Product360Viewer from '../components/products/Product360Viewer.jsx';
import Breadcrumbs from '../components/common/Breadcrumbs.jsx';
import ServiceCard from '../components/services/ServiceCard.jsx';

describe('ProductCard Component', () => {
  const mockProduct = {
    _id: 'prod_123',
    name: 'AquaPure Elite RO',
    slug: 'aquapure-elite-ro',
    categoryName: 'Wall-Mounted',
    shortDescription: 'Advanced 7-stage RO water purifier with TDS controller.',
    features: ['7-Stage Filtration', '10L Capacity'],
    purificationTechnology: 'RO + UV + UF',
    price: 399,
    priceDisplayMode: 'show_price',
    images: [{ url: 'https://example.com/p1.jpg', isPrimary: true }],
    threeSixty: { isEnabled: true, frames: [{ url: 'https://example.com/f1.jpg' }] },
  };

  it('renders product details and calls to action without any shopping cart buttons', () => {
    render(
      <BrowserRouter>
        <ProductCard product={mockProduct} />
      </BrowserRouter>
    );

    expect(screen.getByText('AquaPure Elite RO')).toBeInTheDocument();
    expect(screen.getByText('Wall-Mounted')).toBeInTheDocument();
    expect(screen.getByText('$399')).toBeInTheDocument();
    expect(screen.getByText('View Details')).toBeInTheDocument();
    expect(screen.getByText('Enquire Now')).toBeInTheDocument();

    // Verify STRICTLY NO shopping cart or checkout buttons exist
    expect(screen.queryByText(/add to cart/i)).toBeNull();
    expect(screen.queryByText(/buy now/i)).toBeNull();
    expect(screen.queryByText(/checkout/i)).toBeNull();
  });
});

describe('Product360Viewer Component', () => {
  const mockFrames = [
    { order: 1, url: 'https://example.com/f1.jpg' },
    { order: 2, url: 'https://example.com/f2.jpg' },
    { order: 3, url: 'https://example.com/f3.jpg' },
  ];

  it('renders 360 viewer with frame count and navigation buttons', () => {
    render(<Product360Viewer frames={mockFrames} productName="AquaPure RO" />);

    expect(screen.getByText(/360° Interactive View/i)).toBeInTheDocument();
    expect(screen.getByText(/Frame 1\/3/i)).toBeInTheDocument();

    const nextBtn = screen.getByLabelText('Next rotation frame');
    fireEvent.click(nextBtn);

    expect(screen.getByText(/Frame 2\/3/i)).toBeInTheDocument();
  });
});

describe('Breadcrumbs Component', () => {
  it('renders breadcrumb links properly', () => {
    render(
      <BrowserRouter>
        <Breadcrumbs
          items={[
            { label: 'Products', href: '/products' },
            { label: 'AquaPure Grand' },
          ]}
        />
      </BrowserRouter>
    );

    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('AquaPure Grand')).toBeInTheDocument();
  });
});

describe('ServiceCard Component', () => {
  const mockService = {
    _id: 'srv_1',
    name: 'Certified Installation',
    shortDescription: 'Unboxing and food-grade plumbing installation.',
    price: 39,
    pricingDisplayMode: 'starting_at',
    features: ['Inlet TDS Check', 'Zero leak test'],
  };

  it('renders service details and request service button', () => {
    render(<ServiceCard service={mockService} />);

    expect(screen.getByText('Certified Installation')).toBeInTheDocument();
    expect(screen.getByText('From $39')).toBeInTheDocument();
    expect(screen.getByText('Request Service')).toBeInTheDocument();
  });
});
