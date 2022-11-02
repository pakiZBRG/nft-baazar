/* eslint-disable jsx-a11y/anchor-is-valid */
import Link from 'next/link';
import React from 'react';

const ErrorPage = () => (
  <div className="text-slate-100 text-center my-40 text-2xl">
    <h1 className="mb-5">The route does not exist. Please go back to the main page</h1>
    <Link href="/" passHref>
      <a className="underline">
        Home
      </a>
    </Link>
  </div>
);

export default ErrorPage;
