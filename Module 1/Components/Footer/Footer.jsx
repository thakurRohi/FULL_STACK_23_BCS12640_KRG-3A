import React from 'react'
import { Link } from 'react-router-dom'
import Logo from '../Logo'

function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center">
              <Logo width="100px" />
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              &copy; Copyright 2024. All Rights Reserved by DevUI.
            </p>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-900">
              Company
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  className="text-sm text-slate-600 hover:text-slate-900 transition-colors duration-200"
                  to="/"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  className="text-sm text-slate-600 hover:text-slate-900 transition-colors duration-200"
                  to="/"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  className="text-sm text-slate-600 hover:text-slate-900 transition-colors duration-200"
                  to="/"
                >
                  Affiliate Program
                </Link>
              </li>
              <li>
                <Link
                  className="text-sm text-slate-600 hover:text-slate-900 transition-colors duration-200"
                  to="/"
                >
                  Press Kit
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-900">
              Support
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  className="text-sm text-slate-600 hover:text-slate-900 transition-colors duration-200"
                  to="/"
                >
                  Account
                </Link>
              </li>
              <li>
                <Link
                  className="text-sm text-slate-600 hover:text-slate-900 transition-colors duration-200"
                  to="/"
                >
                  Help
                </Link>
              </li>
              <li>
                <Link
                  className="text-sm text-slate-600 hover:text-slate-900 transition-colors duration-200"
                  to="/"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  className="text-sm text-slate-600 hover:text-slate-900 transition-colors duration-200"
                  to="/"
                >
                  Customer Support
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-900">
              Legals
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  className="text-sm text-slate-600 hover:text-slate-900 transition-colors duration-200"
                  to="/"
                >
                  Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <Link
                  className="text-sm text-slate-600 hover:text-slate-900 transition-colors duration-200"
                  to="/"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  className="text-sm text-slate-600 hover:text-slate-900 transition-colors duration-200"
                  to="/"
                >
                  Licensing
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer