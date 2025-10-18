import React, { useState, useRef, useEffect } from 'react';
import type { PortfolioPosition } from '../types';

// Données simulées étendues pour inclure le type, le secteur et les dates d'événements financiers.
const mockData = [
  // --- Actions Américaines (S&P 500 et autres leaders) ---
  { name: 'Apple Inc.', ticker: 'AAPL', logo: 'https://logo.clearbit.com/apple.com', type: 'Action', sector: 'Technologie', geo: 'Amérique du Nord', nextEarningsDate: '2024-10-28', nextDividendDate: '2024-11-15' },
  { name: 'Microsoft Corporation', ticker: 'MSFT', logo: 'https://logo.clearbit.com/microsoft.com', type: 'Action', sector: 'Technologie', geo: 'Amérique du Nord', nextEarningsDate: '2024-10-22', nextDividendDate: '2024-12-12' },
  { name: 'Amazon.com, Inc.', ticker: 'AMZN', logo: 'https://logo.clearbit.com/amazon.com', type: 'Action', sector: 'Consommation discrétionnaire', geo: 'Amérique du Nord', nextEarningsDate: '2024-10-24' },
  { name: 'Alphabet Inc. (Google)', ticker: 'GOOGL', logo: 'https://logo.clearbit.com/abc.xyz', type: 'Action', sector: 'Services de communication', geo: 'Amérique du Nord', nextEarningsDate: '2024-10-22' },
  { name: 'Meta Platforms, Inc.', ticker: 'META', logo: 'https://logo.clearbit.com/meta.com', type: 'Action', sector: 'Services de communication', geo: 'Amérique du Nord', nextEarningsDate: '2024-10-30' },
  { name: 'Tesla, Inc.', ticker: 'TSLA', logo: 'https://logo.clearbit.com/tesla.com', type: 'Action', sector: 'Consommation discrétionnaire', geo: 'Amérique du Nord', nextEarningsDate: '2024-10-17' },
  { name: 'NVIDIA Corporation', ticker: 'NVDA', logo: 'https://logo.clearbit.com/nvidia.com', type: 'Action', sector: 'Technologie', geo: 'Amérique du Nord', nextEarningsDate: '2024-11-20', nextDividendDate: '2024-12-27' },
  { name: 'Berkshire Hathaway Inc.', ticker: 'BRK.B', logo: 'https://logo.clearbit.com/berkshirehathaway.com', type: 'Action', sector: 'Finance', geo: 'Amérique du Nord', nextEarningsDate: '2024-11-04' },
  { name: 'JPMorgan Chase & Co.', ticker: 'JPM', logo: 'https://logo.clearbit.com/jpmorganchase.com', type: 'Action', sector: 'Finance', geo: 'Amérique du Nord', nextEarningsDate: '2024-10-15', nextDividendDate: '2024-11-06' },
  { name: 'Johnson & Johnson', ticker: 'JNJ', logo: 'https://logo.clearbit.com/jnj.com', type: 'Action', sector: 'Santé', geo: 'Amérique du Nord', nextEarningsDate: '2024-10-15', nextDividendDate: '2024-12-09' },
  { name: 'Visa Inc.', ticker: 'V', logo: 'https://logo.clearbit.com/visa.com', type: 'Action', sector: 'Finance', geo: 'Amérique du Nord', nextEarningsDate: '2024-10-23', nextDividendDate: '2024-12-09' },
  { name: 'Procter & Gamble Co.', ticker: 'PG', logo: 'https://logo.clearbit.com/pg.com', type: 'Action', sector: 'Consommation de base', geo: 'Amérique du Nord', nextEarningsDate: '2024-10-22', nextDividendDate: '2024-11-15' },
  { name: 'Mastercard Incorporated', ticker: 'MA', logo: 'https://logo.clearbit.com/mastercard.com', type: 'Action', sector: 'Finance', geo: 'Amérique du Nord', nextEarningsDate: '2024-10-29', nextDividendDate: '2024-11-08' },
  { name: 'Netflix, Inc.', ticker: 'NFLX', logo: 'https://logo.clearbit.com/netflix.com', type: 'Action', sector: 'Services de communication', geo: 'Amérique du Nord', nextEarningsDate: '2024-10-21' },
  { name: 'Salesforce, Inc.', ticker: 'CRM', logo: 'https://logo.clearbit.com/salesforce.com', type: 'Action', sector: 'Technologie', geo: 'Amérique du Nord', nextEarningsDate: '2024-12-04' },
  { name: 'Adobe Inc.', ticker: 'ADBE', logo: 'https://logo.clearbit.com/adobe.com', type: 'Action', sector: 'Technologie', geo: 'Amérique du Nord', nextEarningsDate: '2024-12-12' },
  { name: 'The Coca-Cola Company', ticker: 'KO', logo: 'https://logo.clearbit.com/coca-colacompany.com', type: 'Action', sector: 'Consommation de base', geo: 'Amérique du Nord', nextEarningsDate: '2024-10-22', nextDividendDate: '2024-12-16' },
  { name: 'PepsiCo, Inc.', ticker: 'PEP', logo: 'https://logo.clearbit.com/pepsico.com', type: 'Action', sector: 'Consommation de base', geo: 'Amérique du Nord', nextEarningsDate: '2024-10-09', nextDividendDate: '2024-12-06' },
  { name: 'Walt Disney Company', ticker: 'DIS', logo: 'https://logo.clearbit.com/thewaltdisneycompany.com', type: 'Action', sector: 'Services de communication', geo: 'Amérique du Nord', nextEarningsDate: '2024-11-13', nextDividendDate: '2025-01-10' },
  { name: 'McDonald\'s Corporation', ticker: 'MCD', logo: 'https://logo.clearbit.com/mcdonalds.com', type: 'Action', sector: 'Consommation discrétionnaire', geo: 'Amérique du Nord', nextEarningsDate: '2024-10-21', nextDividendDate: '2024-12-16' },
  { name: 'Intel Corporation', ticker: 'INTC', logo: 'https://logo.clearbit.com/intel.com', type: 'Action', sector: 'Technologie', geo: 'Amérique du Nord' },
  { name: 'Advanced Micro Devices, Inc.', ticker: 'AMD', logo: 'https://logo.clearbit.com/amd.com', type: 'Action', sector: 'Technologie', geo: 'Amérique du Nord' },
  { name: 'Oracle Corporation', ticker: 'ORCL', logo: 'https://logo.clearbit.com/oracle.com', type: 'Action', sector: 'Technologie', geo: 'Amérique du Nord' },
  { name: 'Cisco Systems, Inc.', ticker: 'CSCO', logo: 'https://logo.clearbit.com/cisco.com', type: 'Action', sector: 'Technologie', geo: 'Amérique du Nord' },
  { name: 'Qualcomm Incorporated', ticker: 'QCOM', logo: 'https://logo.clearbit.com/qualcomm.com', type: 'Action', sector: 'Technologie', geo: 'Amérique du Nord' },
  { name: 'Broadcom Inc.', ticker: 'AVGO', logo: 'https://logo.clearbit.com/broadcom.com', type: 'Action', sector: 'Technologie', geo: 'Amérique du Nord' },
  { name: 'Walmart Inc.', ticker: 'WMT', logo: 'https://logo.clearbit.com/walmart.com', type: 'Action', sector: 'Consommation de base', geo: 'Amérique du Nord' },
  { name: 'The Home Depot, Inc.', ticker: 'HD', logo: 'https://logo.clearbit.com/homedepot.com', type: 'Action', sector: 'Consommation discrétionnaire', geo: 'Amérique du Nord' },
  { name: 'NIKE, Inc.', ticker: 'NKE', logo: 'https://logo.clearbit.com/nike.com', type: 'Action', sector: 'Consommation discrétionnaire', geo: 'Amérique du Nord' },
  { name: 'Starbucks Corporation', ticker: 'SBUX', logo: 'https://logo.clearbit.com/starbucks.com', type: 'Action', sector: 'Consommation discrétionnaire', geo: 'Amérique du Nord' },
  { name: 'Bank of America Corp', ticker: 'BAC', logo: 'https://logo.clearbit.com/bankofamerica.com', type: 'Action', sector: 'Finance', geo: 'Amérique du Nord' },
  { name: 'Wells Fargo & Company', ticker: 'WFC', logo: 'https://logo.clearbit.com/wellsfargo.com', type: 'Action', sector: 'Finance', geo: 'Amérique du Nord' },
  { name: 'Exxon Mobil Corporation', ticker: 'XOM', logo: 'https://logo.clearbit.com/exxonmobil.com', type: 'Action', sector: 'Énergie', geo: 'Amérique du Nord' },
  { name: 'Chevron Corporation', ticker: 'CVX', logo: 'https://logo.clearbit.com/chevron.com', type: 'Action', sector: 'Énergie', geo: 'Amérique du Nord' },
  { name: 'Pfizer Inc.', ticker: 'PFE', logo: 'https://logo.clearbit.com/pfizer.com', type: 'Action', sector: 'Santé', geo: 'Amérique du Nord' },
  { name: 'Merck & Co., Inc.', ticker: 'MRK', logo: 'https://logo.clearbit.com/merck.com', type: 'Action', sector: 'Santé', geo: 'Amérique du Nord' },
  { name: 'AbbVie Inc.', ticker: 'ABBV', logo: 'https://logo.clearbit.com/abbvie.com', type: 'Action', sector: 'Santé', geo: 'Amérique du Nord' },
  { name: 'UnitedHealth Group Incorporated', ticker: 'UNH', logo: 'https://logo.clearbit.com/unh.com', type: 'Action', sector: 'Santé', geo: 'Amérique du Nord' },
  { name: 'AT&T Inc.', ticker: 'T', logo: 'https://logo.clearbit.com/att.com', type: 'Action', sector: 'Services de communication', geo: 'Amérique du Nord' },
  { name: 'Verizon Communications Inc.', ticker: 'VZ', logo: 'https://logo.clearbit.com/verizon.com', type: 'Action', sector: 'Services de communication', geo: 'Amérique du Nord' },
  { name: '3M Company', ticker: 'MMM', logo: 'https://logo.clearbit.com/3m.com', type: 'Action', sector: 'Industrie', geo: 'Amérique du Nord' },
  { name: 'Abbott Laboratories', ticker: 'ABT', logo: 'https://logo.clearbit.com/abbott.com', type: 'Action', sector: 'Santé', geo: 'Amérique du Nord' },
  { name: 'Accenture plc', ticker: 'ACN', logo: 'https://logo.clearbit.com/accenture.com', type: 'Action', sector: 'Technologie', geo: 'Monde' }, // Headquartered in Ireland for tax purposes, but operates globally
  { name: 'Aflac Incorporated', ticker: 'AFL', logo: 'https://logo.clearbit.com/aflac.com', type: 'Action', sector: 'Finance', geo: 'Amérique du Nord' },
  { name: 'American Express Company', ticker: 'AXP', logo: 'https://logo.clearbit.com/americanexpress.com', type: 'Action', sector: 'Finance', geo: 'Amérique du Nord' },
  { name: 'Amgen Inc.', ticker: 'AMGN', logo: 'https://logo.clearbit.com/amgen.com', type: 'Action', sector: 'Santé', geo: 'Amérique du Nord' },
  { name: 'Boeing Company', ticker: 'BA', logo: 'https://logo.clearbit.com/boeing.com', type: 'Action', sector: 'Industrie', geo: 'Amérique du Nord' },
  { name: 'Booking Holdings Inc.', ticker: 'BKNG', logo: 'https://logo.clearbit.com/bookingholdings.com', type: 'Action', sector: 'Consommation discrétionnaire', geo: 'Amérique du Nord' },
  { name: 'Bristol-Myers Squibb Company', ticker: 'BMY', logo: 'https://logo.clearbit.com/bms.com', type: 'Action', sector: 'Santé', geo: 'Amérique du Nord' },
  { name: 'Caterpillar Inc.', ticker: 'CAT', logo: 'https://logo.clearbit.com/caterpillar.com', type: 'Action', sector: 'Industrie', geo: 'Amérique du Nord' },
  { name: 'Charles Schwab Corporation', ticker: 'SCHW', logo: 'https://logo.clearbit.com/schwab.com', type: 'Action', sector: 'Finance', geo: 'Amérique du Nord' },
  { name: 'Citigroup Inc.', ticker: 'C', logo: 'https://logo.clearbit.com/citigroup.com', type: 'Action', sector: 'Finance', geo: 'Amérique du Nord' },
  { name: 'Colgate-Palmolive Company', ticker: 'CL', logo: 'https://logo.clearbit.com/colgatepalmolive.com', type: 'Action', sector: 'Consommation de base', geo: 'Amérique du Nord' },
  { name: 'Comcast Corporation', ticker: 'CMCSA', logo: 'https://logo.clearbit.com/comcast.com', type: 'Action', sector: 'Services de communication', geo: 'Amérique du Nord' },
  { name: 'ConocoPhillips', ticker: 'COP', logo: 'https://logo.clearbit.com/conocophillips.com', type: 'Action', sector: 'Énergie', geo: 'Amérique du Nord' },
  { name: 'Costco Wholesale Corporation', ticker: 'COST', logo: 'https://logo.clearbit.com/costco.com', type: 'Action', sector: 'Consommation de base', geo: 'Amérique du Nord' },
  { name: 'CVS Health Corporation', ticker: 'CVS', logo: 'https://logo.clearbit.com/cvshealth.com', type: 'Action', sector: 'Santé', geo: 'Amérique du Nord' },
  { name: 'Deere & Company', ticker: 'DE', logo: 'https://logo.clearbit.com/deere.com', type: 'Action', sector: 'Industrie', geo: 'Amérique du Nord' },
  { name: 'Dell Technologies Inc.', ticker: 'DELL', logo: 'https://logo.clearbit.com/dell.com', type: 'Action', sector: 'Technologie', geo: 'Amérique du Nord' },
  { name: 'Delta Air Lines, Inc.', ticker: 'DAL', logo: 'https://logo.clearbit.com/delta.com', type: 'Action', sector: 'Industrie', geo: 'Amérique du Nord' },
  { name: 'Dow Inc.', ticker: 'DOW', logo: 'https://logo.clearbit.com/dow.com', type: 'Action', sector: 'Matériaux', geo: 'Amérique du Nord' },
  { name: 'FedEx Corporation', ticker: 'FDX', logo: 'https://logo.clearbit.com/fedex.com', type: 'Action', sector: 'Industrie', geo: 'Amérique du Nord' },
  { name: 'Ford Motor Company', ticker: 'F', logo: 'https://logo.clearbit.com/ford.com', type: 'Action', sector: 'Consommation discrétionnaire', geo: 'Amérique du Nord' },
  { name: 'General Electric Company', ticker: 'GE', logo: 'https://logo.clearbit.com/ge.com', type: 'Action', sector: 'Industrie', geo: 'Amérique du Nord' },
  { name: 'General Motors Company', ticker: 'GM', logo: 'https://logo.clearbit.com/gm.com', type: 'Action', sector: 'Consommation discrétionnaire', geo: 'Amérique du Nord' },
  { name: 'Gilead Sciences, Inc.', ticker: 'GILD', logo: 'https://logo.clearbit.com/gilead.com', type: 'Action', sector: 'Santé', geo: 'Amérique du Nord' },
  { name: 'Goldman Sachs Group, Inc.', ticker: 'GS', logo: 'https://logo.clearbit.com/goldmansachs.com', type: 'Action', sector: 'Finance', geo: 'Amérique du Nord' },
  { name: 'Honeywell International Inc.', ticker: 'HON', logo: 'https://logo.clearbit.com/honeywell.com', type: 'Action', sector: 'Industrie', geo: 'Amérique du Nord' },
  { name: 'HP Inc.', ticker: 'HPQ', logo: 'https://logo.clearbit.com/hp.com', type: 'Action', sector: 'Technologie', geo: 'Amérique du Nord' },
  { name: 'IBM', ticker: 'IBM', logo: 'https://logo.clearbit.com/ibm.com', type: 'Action', sector: 'Technologie', geo: 'Amérique du Nord' },
  { name: 'Intuitive Surgical, Inc.', ticker: 'ISRG', logo: 'https://logo.clearbit.com/intuitive.com', type: 'Action', sector: 'Santé', geo: 'Amérique du Nord' },
  { name: 'Lockheed Martin Corporation', ticker: 'LMT', logo: 'https://logo.clearbit.com/lockheedmartin.com', type: 'Action', sector: 'Industrie', geo: 'Amérique du Nord' },
  { name: 'Lowe\'s Companies, Inc.', ticker: 'LOW', logo: 'https://logo.clearbit.com/lowes.com', type: 'Action', sector: 'Consommation discrétionnaire', geo: 'Amérique du Nord' },
  { name: 'Micron Technology, Inc.', ticker: 'MU', logo: 'https://logo.clearbit.com/micron.com', type: 'Action', sector: 'Technologie', geo: 'Amérique du Nord' },
  { name: 'Moderna, Inc.', ticker: 'MRNA', logo: 'https://logo.clearbit.com/modernatx.com', type: 'Action', sector: 'Santé', geo: 'Amérique du Nord' },
  { name: 'Morgan Stanley', ticker: 'MS', logo: 'https://logo.clearbit.com/morganstanley.com', type: 'Action', sector: 'Finance', geo: 'Amérique du Nord' },
  { name: 'PayPal Holdings, Inc.', ticker: 'PYPL', logo: 'https://logo.clearbit.com/paypal.com', type: 'Action', sector: 'Finance', geo: 'Amérique du Nord' },
  { name: 'Raytheon Technologies Corporation', ticker: 'RTX', logo: 'https://logo.clearbit.com/rtx.com', type: 'Action', sector: 'Industrie', geo: 'Amérique du Nord' },
  { name: 'S&P Global Inc.', ticker: 'SPGI', logo: 'https://logo.clearbit.com/spglobal.com', type: 'Action', sector: 'Finance', geo: 'Amérique du Nord' },
  { name: 'Target Corporation', ticker: 'TGT', logo: 'https://logo.clearbit.com/target.com', type: 'Action', sector: 'Consommation discrétionnaire', geo: 'Amérique du Nord' },
  { name: 'Texas Instruments Incorporated', ticker: 'TXN', logo: 'https://logo.clearbit.com/ti.com', type: 'Action', sector: 'Technologie', geo: 'Amérique du Nord' },
  { name: 'T-Mobile US, Inc.', ticker: 'TMUS', logo: 'https://logo.clearbit.com/t-mobile.com', type: 'Action', sector: 'Services de communication', geo: 'Amérique du Nord' },
  { name: 'Union Pacific Corporation', ticker: 'UNP', logo: 'https://logo.clearbit.com/up.com', type: 'Action', sector: 'Industrie', geo: 'Amérique du Nord' },
  { name: 'United Parcel Service, Inc.', ticker: 'UPS', logo: 'https://logo.clearbit.com/ups.com', type: 'Action', sector: 'Industrie', geo: 'Amérique du Nord' },
  { name: 'Walgreens Boots Alliance, Inc.', ticker: 'WBA', logo: 'https://logo.clearbit.com/walgreensbootsalliance.com', type: 'Action', sector: 'Consommation de base', geo: 'Amérique du Nord' },
  { name: 'Waste Management, Inc.', ticker: 'WM', logo: 'https://logo.clearbit.com/wm.com', type: 'Action', sector: 'Industrie', geo: 'Amérique du Nord' },
  { name: 'Teradyne Inc.', ticker: 'TER', logo: 'https://logo.clearbit.com/teradyne.com', type: 'Action', sector: 'Technologie', geo: 'Amérique du Nord' },
  { name: 'Applied Materials, Inc.', ticker: 'AMAT', logo: 'https://logo.clearbit.com/appliedmaterials.com', type: 'Action', sector: 'Technologie', geo: 'Amérique du Nord' },
  { name: 'Lam Research Corporation', ticker: 'LRCX', logo: 'https://logo.clearbit.com/lamresearch.com', type: 'Action', sector: 'Technologie', geo: 'Amérique du Nord' },
  { name: 'KLA Corporation', ticker: 'KLAC', logo: 'https://logo.clearbit.com/kla.com', type: 'Action', sector: 'Technologie', geo: 'Amérique du Nord' },
  { name: 'Rockwell Automation, Inc.', ticker: 'ROK', logo: 'https://logo.clearbit.com/rockwellautomation.com', type: 'Action', sector: 'Industrie', geo: 'Amérique du Nord' },
  { name: 'Emerson Electric Co.', ticker: 'EMR', logo: 'https://logo.clearbit.com/emerson.com', type: 'Action', sector: 'Industrie', geo: 'Amérique du Nord' },

  // --- Actions Européennes (CAC 40 et autres leaders) ---
  { name: 'Accor SA', ticker: 'AC.PA', logo: 'https://logo.clearbit.com/accor.com', type: 'Action', sector: 'Consommation discrétionnaire', geo: 'Europe' },
  { name: 'Air Liquide S.A.', ticker: 'AI.PA', logo: 'https://logo.clearbit.com/airliquide.com', type: 'Action', sector: 'Matériaux', geo: 'Europe', nextEarningsDate: '2024-10-24', nextDividendDate: '2025-05-20' },
  { name: 'Airbus SE', ticker: 'AIR.PA', logo: 'https://logo.clearbit.com/airbus.com', type: 'Action', sector: 'Industrie', geo: 'Europe', nextEarningsDate: '2024-10-30' },
  { name: 'Alstom SA', ticker: 'ALO.PA', logo: 'https://logo.clearbit.com/alstom.com', type: 'Action', sector: 'Industrie', geo: 'Europe' },
  { name: 'ArcelorMittal', ticker: 'MT.AS', logo: 'https://logo.clearbit.com/arcelormittal.com', type: 'Action', sector: 'Matériaux', geo: 'Europe', nextEarningsDate: '2024-11-07' },
  { name: 'ASML Holding N.V.', ticker: 'ASML', logo: 'https://logo.clearbit.com/asml.com', type: 'Action', sector: 'Technologie', geo: 'Europe', nextEarningsDate: '2024-10-16', nextDividendDate: '2024-11-14' },
  { name: 'AXA SA', ticker: 'CS.PA', logo: 'https://logo.clearbit.com/axa.com', type: 'Action', sector: 'Finance', geo: 'Europe' },
  { name: 'BNP Paribas S.A.', ticker: 'BNP.PA', logo: 'https://logo.clearbit.com/bnpparibas.com', type: 'Action', sector: 'Finance', geo: 'Europe', nextEarningsDate: '2024-10-29' },
  { name: 'Bouygues SA', ticker: 'EN.PA', logo: 'https://logo.clearbit.com/bouygues.com', type: 'Action', sector: 'Industrie', geo: 'Europe' },
  { name: 'Capgemini SE', ticker: 'CAP.PA', logo: 'https://logo.clearbit.com/capgemini.com', type: 'Action', sector: 'Technologie', geo: 'Europe' },
  { name: 'Carrefour SA', ticker: 'CA.PA', logo: 'https://logo.clearbit.com/carrefour.com', type: 'Action', sector: 'Consommation de base', geo: 'Europe' },
  { name: 'Christian Dior SE', ticker: 'CDI.PA', logo: 'https://logo.clearbit.com/dior.com', type: 'Action', sector: 'Consommation discrétionnaire', geo: 'Europe' },
  { name: 'Crédit Agricole S.A.', ticker: 'ACA.PA', logo: 'https://logo.clearbit.com/credit-agricole.com', type: 'Action', sector: 'Finance', geo: 'Europe' },
  { name: 'Danone S.A.', ticker: 'BN.PA', logo: 'https://logo.clearbit.com/danone.com', type: 'Action', sector: 'Consommation de base', geo: 'Europe' },
  { name: 'Dassault Systèmes SE', ticker: 'DSY.PA', logo: 'https://logo.clearbit.com/3ds.com', type: 'Action', sector: 'Technologie', geo: 'Europe' },
  { name: 'Engie SA', ticker: 'ENGI.PA', logo: 'https://logo.clearbit.com/engie.com', type: 'Action', sector: 'Services aux collectivités', geo: 'Europe' },
  { name: 'EssilorLuxottica SA', ticker: 'EL.PA', logo: 'https://logo.clearbit.com/essilorluxottica.com', type: 'Action', sector: 'Santé', geo: 'Europe' },
  { name: 'Eurofins Scientific SE', ticker: 'ERF.PA', logo: 'https://logo.clearbit.com/eurofins.com', type: 'Action', sector: 'Santé', geo: 'Europe' },
  { name: 'Hermès International S.C.A.', ticker: 'RMS.PA', logo: 'https://logo.clearbit.com/hermes.com', type: 'Action', sector: 'Consommation discrétionnaire', geo: 'Europe', nextEarningsDate: '2024-10-24' },
  { name: 'Kering SA', ticker: 'KER.PA', logo: 'https://logo.clearbit.com/kering.com', type: 'Action', sector: 'Consommation discrétionnaire', geo: 'Europe', nextEarningsDate: '2024-10-22' },
  { name: 'L\'Oréal S.A.', ticker: 'OR.PA', logo: 'https://logo.clearbit.com/loreal.com', type: 'Action', sector: 'Consommation de base', geo: 'Europe', nextEarningsDate: '2024-10-18' },
  { name: 'Legrand SA', ticker: 'LR.PA', logo: 'https://logo.clearbit.com/legrand.com', type: 'Action', sector: 'Industrie', geo: 'Europe' },
  { name: 'LVMH Moët Hennessy Louis Vuitton SE', ticker: 'MC.PA', logo: 'https://logo.clearbit.com/lvmh.com', type: 'Action', sector: 'Consommation discrétionnaire', geo: 'Europe', nextEarningsDate: '2024-10-15', nextDividendDate: '2024-12-05' },
  { name: 'Michelin SCA', ticker: 'ML.PA', logo: 'https://logo.clearbit.com/michelin.com', type: 'Action', sector: 'Consommation discrétionnaire', geo: 'Europe' },
  { name: 'Orange S.A.', ticker: 'ORA.PA', logo: 'https://logo.clearbit.com/orange.com', type: 'Action', sector: 'Services de communication', geo: 'Europe' },
  { name: 'Pernod Ricard SA', ticker: 'RI.PA', logo: 'https://logo.clearbit.com/pernod-ricard.com', type: 'Action', sector: 'Consommation de base', geo: 'Europe' },
  { name: 'Publicis Groupe S.A.', ticker: 'PUB.PA', logo: 'https://logo.clearbit.com/publicisgroupe.com', type: 'Action', sector: 'Services de communication', geo: 'Europe' },
  { name: 'Renault SA', ticker: 'RNO.PA', logo: 'https://logo.clearbit.com/renaultgroup.com', type: 'Action', sector: 'Consommation discrétionnaire', geo: 'Europe' },
  { name: 'Safran SA', ticker: 'SAF.PA', logo: 'https://logo.clearbit.com/safran-group.com', type: 'Action', sector: 'Industrie', geo: 'Europe' },
  { name: 'Saint-Gobain S.A.', ticker: 'SGO.PA', logo: 'https://logo.clearbit.com/saint-gobain.com', type: 'Action', sector: 'Industrie', geo: 'Europe' },
  { name: 'Sanofi', ticker: 'SAN.PA', logo: 'https://logo.clearbit.com/sanofi.com', type: 'Action', sector: 'Santé', geo: 'Europe', nextEarningsDate: '2024-10-25', nextDividendDate: '2025-05-15' },
  { name: 'SAP SE', ticker: 'SAP', logo: 'https://logo.clearbit.com/sap.com', type: 'Action', sector: 'Technologie', geo: 'Europe', nextEarningsDate: '2024-10-21' },
  { name: 'Schneider Electric S.E.', ticker: 'SU.PA', logo: 'https://logo.clearbit.com/se.com', type: 'Action', sector: 'Industrie', geo: 'Europe' },
  { name: 'Société Générale S.A.', ticker: 'GLE.PA', logo: 'https://logo.clearbit.com/societegenerale.com', type: 'Action', sector: 'Finance', geo: 'Europe' },
  { name: 'Stellantis N.V.', ticker: 'STLA.PA', logo: 'https://logo.clearbit.com/stellantis.com', type: 'Action', sector: 'Consommation discrétionnaire', geo: 'Europe' },
  { name: 'STMicroelectronics N.V.', ticker: 'STMPA.PA', logo: 'https://logo.clearbit.com/st.com', type: 'Action', sector: 'Technologie', geo: 'Europe' },
  { name: 'Teleperformance SE', ticker: 'TEP.PA', logo: 'https://logo.clearbit.com/teleperformance.com', type: 'Action', sector: 'Industrie', geo: 'Europe' },
  { name: 'Thales S.A.', ticker: 'HO.PA', logo: 'https://logo.clearbit.com/thalesgroup.com', type: 'Action', sector: 'Industrie', geo: 'Europe' },
  { name: 'TotalEnergies SE', ticker: 'TTE', logo: 'https://logo.clearbit.com/totalenergies.com', type: 'Action', sector: 'Énergie', geo: 'Europe', nextEarningsDate: '2024-10-31', nextDividendDate: '2025-01-03' },
  { name: 'Veolia Environnement S.A.', ticker: 'VIE.PA', logo: 'https://logo.clearbit.com/veolia.com', type: 'Action', sector: 'Services aux collectivités', geo: 'Europe' },
  { name: 'Vinci SA', ticker: 'DG.PA', logo: 'https://logo.clearbit.com/vinci.com', type: 'Action', sector: 'Industrie', geo: 'Europe' },
  { name: 'Vivendi SE', ticker: 'VIV.PA', logo: 'https://logo.clearbit.com/vivendi.com', type: 'Action', sector: 'Services de communication', geo: 'Europe' },
  { name: 'Worldline SA', ticker: 'WLN.PA', logo: 'https://logo.clearbit.com/worldline.com', type: 'Action', sector: 'Technologie', geo: 'Europe' },
  { name: 'Siemens AG', ticker: 'SIE.DE', logo: 'https://logo.clearbit.com/siemens.com', type: 'Action', sector: 'Industrie', geo: 'Europe' },
  { name: 'Allianz SE', ticker: 'ALV.DE', logo: 'https://logo.clearbit.com/allianz.com', type: 'Action', sector: 'Finance', geo: 'Europe' },
  { name: 'Nestlé S.A.', ticker: 'NESN.SW', logo: 'https://logo.clearbit.com/nestle.com', type: 'Action', sector: 'Consommation de base', geo: 'Europe' },
  { name: 'Roche Holding AG', ticker: 'ROG.SW', logo: 'https://logo.clearbit.com/roche.com', type: 'Action', sector: 'Santé', geo: 'Europe' },
  { name: 'Novartis AG', ticker: 'NOVN.SW', logo: 'https://logo.clearbit.com/novartis.com', type: 'Action', sector: 'Santé', geo: 'Europe' },
  { name: 'AstraZeneca PLC', ticker: 'AZN.L', logo: 'https://logo.clearbit.com/astrazeneca.com', type: 'Action', sector: 'Santé', geo: 'Europe' },
  { name: 'Shell plc', ticker: 'SHEL.L', logo: 'https://logo.clearbit.com/shell.com', type: 'Action', sector: 'Énergie', geo: 'Europe' },
  { name: 'BP p.l.c.', ticker: 'BP.L', logo: 'https://logo.clearbit.com/bp.com', type: 'Action', sector: 'Énergie', geo: 'Europe' },
  { name: 'HSBC Holdings plc', ticker: 'HSBA.L', logo: 'https://logo.clearbit.com/hsbc.com', type: 'Action', sector: 'Finance', geo: 'Europe' },
  { name: 'Unilever PLC', ticker: 'ULVR.L', logo: 'https://logo.clearbit.com/unilever.com', type: 'Action', sector: 'Consommation de base', geo: 'Europe' },
  { name: 'Diageo plc', ticker: 'DGE.L', logo: 'https://logo.clearbit.com/diageo.com', type: 'Action', sector: 'Consommation de base', geo: 'Europe' },
  { name: 'Inditex (Zara)', ticker: 'ITX.MC', logo: 'https://logo.clearbit.com/inditex.com', type: 'Action', sector: 'Consommation discrétionnaire', geo: 'Europe' },
  { name: 'Iberdrola, S.A.', ticker: 'IBE.MC', logo: 'https://logo.clearbit.com/iberdrola.com', type: 'Action', sector: 'Services aux collectivités', geo: 'Europe' },
  { name: 'Volkswagen AG', ticker: 'VOW3.DE', logo: 'https://logo.clearbit.com/volkswagenag.com', type: 'Action', sector: 'Consommation discrétionnaire', geo: 'Europe' },
  { name: 'Mercedes-Benz Group AG', ticker: 'MBG.DE', logo: 'https://logo.clearbit.com/mercedes-benz.com', type: 'Action', sector: 'Consommation discrétionnaire', geo: 'Europe' },
  { name: 'BMW AG', ticker: 'BMW.DE', logo: 'https://logo.clearbit.com/bmwgroup.com', type: 'Action', sector: 'Consommation discrétionnaire', geo: 'Europe' },

  // --- Actions Asiatiques (Nikkei 225 et autres leaders) ---
  { name: 'Toyota Motor Corporation', ticker: '7203.T', logo: 'https://logo.clearbit.com/global.toyota', type: 'Action', sector: 'Consommation discrétionnaire', geo: 'Asie', nextEarningsDate: '2024-11-01' },
  { name: 'Sony Group Corporation', ticker: '6758.T', logo: 'https://logo.clearbit.com/sony.com', type: 'Action', sector: 'Consommation discrétionnaire', geo: 'Asie', nextEarningsDate: '2024-10-30' },
  { name: 'Keyence Corporation', ticker: '6861.T', logo: 'https://logo.clearbit.com/keyence.com', type: 'Action', sector: 'Technologie', geo: 'Asie' },
  { name: 'Mitsubishi UFJ Financial Group, Inc.', ticker: '8306.T', logo: 'https://logo.clearbit.com/mufg.jp', type: 'Action', sector: 'Finance', geo: 'Asie' },
  { name: 'Nintendo Co., Ltd.', ticker: '7974.T', logo: 'https://logo.clearbit.com/nintendo.com', type: 'Action', sector: 'Consommation discrétionnaire', geo: 'Asie', nextEarningsDate: '2024-11-05' },
  { name: 'SoftBank Group Corp.', ticker: '9984.T', logo: 'https://logo.clearbit.com/softbank.jp', type: 'Action', sector: 'Services de communication', geo: 'Asie' },
  { name: 'Fast Retailing Co., Ltd. (Uniqlo)', ticker: '9983.T', logo: 'https://logo.clearbit.com/fastretailing.com', type: 'Action', sector: 'Consommation discrétionnaire', geo: 'Asie' },
  { name: 'Takeda Pharmaceutical Company Limited', ticker: '4502.T', logo: 'https://logo.clearbit.com/takeda.com', type: 'Action', sector: 'Santé', geo: 'Asie' },
  { name: 'Hitachi, Ltd.', ticker: '6501.T', logo: 'https://logo.clearbit.com/hitachi.com', type: 'Action', sector: 'Industrie', geo: 'Asie' },
  { name: 'Honda Motor Co., Ltd.', ticker: '7267.T', logo: 'https://logo.clearbit.com/honda.com', type: 'Action', sector: 'Consommation discrétionnaire', geo: 'Asie' },
  { name: 'Sumitomo Mitsui Financial Group, Inc.', ticker: '8316.T', logo: 'https://logo.clearbit.com/smfg.co.jp', type: 'Action', sector: 'Finance', geo: 'Asie' },
  { name: 'Shin-Etsu Chemical Co., Ltd.', ticker: '4063.T', logo: 'https://logo.clearbit.com/shinetsu.co.jp', type: 'Action', sector: 'Matériaux', geo: 'Asie' },
  { name: 'Mizuho Financial Group, Inc.', ticker: '8411.T', logo: 'https://logo.clearbit.com/mizuho-fg.co.jp', type: 'Action', sector: 'Finance', geo: 'Asie' },
  { name: 'Canon Inc.', ticker: '7751.T', logo: 'https://logo.clearbit.com/canon.com', type: 'Action', sector: 'Technologie', geo: 'Asie' },
  { name: 'Panasonic Corporation', ticker: '6752.T', logo: 'https://logo.clearbit.com/panasonic.com', type: 'Action', sector: 'Consommation discrétionnaire', geo: 'Asie' },
  { name: 'Itochu Corporation', ticker: '8001.T', logo: 'https://logo.clearbit.com/itochu.co.jp', type: 'Action', sector: 'Industrie', geo: 'Asie' },
  { name: 'Mitsubishi Corporation', ticker: '8058.T', logo: 'https://logo.clearbit.com/mitsubishicorp.com', type: 'Action', sector: 'Industrie', geo: 'Asie' },
  { name: 'KDDI Corporation', ticker: '9433.T', logo: 'https://logo.clearbit.com/kddi.com', type: 'Action', sector: 'Services de communication', geo: 'Asie' },
  { name: 'Tokyo Electron Limited', ticker: '8035.T', logo: 'https://logo.clearbit.com/tel.com', type: 'Action', sector: 'Technologie', geo: 'Asie' },
  { name: 'Recruit Holdings Co., Ltd.', ticker: '6098.T', logo: 'https://logo.clearbit.com/recruit-holdings.com', type: 'Action', sector: 'Industrie', geo: 'Asie' },
  { name: 'Daikin Industries, Ltd.', ticker: '6367.T', logo: 'https://logo.clearbit.com/daikin.com', type: 'Action', sector: 'Industrie', geo: 'Asie' },
  { name: 'Murata Manufacturing Co., Ltd.', ticker: '6981.T', logo: 'https://logo.clearbit.com/murata.com', type: 'Action', sector: 'Technologie', geo: 'Asie' },
  { name: 'Fujitsu Limited', ticker: '6702.T', logo: 'https://logo.clearbit.com/fujitsu.com', type: 'Action', sector: 'Technologie', geo: 'Asie' },
  { name: 'Bridgestone Corporation', ticker: '5108.T', logo: 'https://logo.clearbit.com/bridgestone.com', type: 'Action', sector: 'Consommation discrétionnaire', geo: 'Asie' },
  { name: 'Seven & i Holdings Co., Ltd. (7-Eleven)', ticker: '3382.T', logo: 'https://logo.clearbit.com/7andi.com', type: 'Action', sector: 'Consommation de base', geo: 'Asie' },
  { name: 'Astellas Pharma Inc.', ticker: '4503.T', logo: 'https://logo.clearbit.com/astellas.com', type: 'Action', sector: 'Santé', geo: 'Asie' },
  { name: 'Fanuc Corporation', ticker: '6954.T', logo: 'https://logo.clearbit.com/fanuc.co.jp', type: 'Action', sector: 'Industrie', geo: 'Asie' },
  { name: 'Komatsu Ltd.', ticker: '6301.T', logo: 'https://logo.clearbit.com/komatsu.jp', type: 'Action', sector: 'Industrie', geo: 'Asie' },
  { name: 'Nissan Motor Co., Ltd.', ticker: '7201.T', logo: 'https://logo.clearbit.com/nissan-global.com', type: 'Action', sector: 'Consommation discrétionnaire', geo: 'Asie' },
  { name: 'Toshiba Corporation', ticker: '6502.T', logo: 'https://logo.clearbit.com/global.toshiba', type: 'Action', sector: 'Industrie', geo: 'Asie' },
  { name: 'Samsung Electronics Co., Ltd.', ticker: '005930.KS', logo: 'https://logo.clearbit.com/samsung.com', type: 'Action', sector: 'Technologie', geo: 'Asie', nextEarningsDate: '2024-10-25' },
  { name: 'Tencent Holdings Ltd.', ticker: 'TCEHY', logo: 'https://logo.clearbit.com/tencent.com', type: 'Action', sector: 'Services de communication', geo: 'Asie', nextEarningsDate: '2024-11-13' },
  { name: 'Alibaba Group Holding Limited', ticker: 'BABA', logo: 'https://logo.clearbit.com/alibabagroup.com', type: 'Action', sector: 'Consommation discrétionnaire', geo: 'Asie', nextEarningsDate: '2024-11-02' },
  { name: 'Taiwan Semiconductor Manufacturing Company (TSMC)', ticker: 'TSM', logo: 'https://logo.clearbit.com/tsmc.com', type: 'Action', sector: 'Technologie', geo: 'Asie', nextEarningsDate: '2024-10-17' },
  { name: 'Kweichow Moutai Co., Ltd.', ticker: '600519.SS', logo: 'https://logo.clearbit.com/moutaichina.com', type: 'Action', sector: 'Consommation de base', geo: 'Asie' },
  { name: 'Reliance Industries Limited', ticker: 'RELIANCE.NS', logo: 'https://logo.clearbit.com/ril.com', type: 'Action', sector: 'Énergie', geo: 'Asie' },
  { name: 'HDFC Bank Limited', ticker: 'HDFCBANK.NS', logo: 'https://logo.clearbit.com/hdfcbank.com', type: 'Action', sector: 'Finance', geo: 'Asie' },
  { name: 'Hyundai Motor Company', ticker: '005380.KS', logo: 'https://logo.clearbit.com/hyundai.com', type: 'Action', sector: 'Consommation discrétionnaire', geo: 'Asie' },
  { name: 'LG Chem Ltd.', ticker: '051910.KS', logo: 'https://logo.clearbit.com/lgchem.com', type: 'Action', sector: 'Matériaux', geo: 'Asie' },
  { name: 'BYD Company Limited', ticker: '1211.HK', logo: 'https://logo.clearbit.com/byd.com', type: 'Action', sector: 'Consommation discrétionnaire', geo: 'Asie' },
  
  // --- ETFs (Fonds Négociés en Bourse) ---
  // --- Indices Mondiaux & US ---
  { name: 'SPDR S&P 500 ETF Trust', ticker: 'SPY', logo: 'https://logo.clearbit.com/ssga.com', type: 'ETF', sector: 'Indice S&P 500', geo: 'Amérique du Nord', nextDividendDate: '2024-12-20' },
  { name: 'iShares Core S&P 500 ETF', ticker: 'IVV', logo: 'https://logo.clearbit.com/blackrock.com', type: 'ETF', sector: 'Indice S&P 500', geo: 'Amérique du Nord', nextDividendDate: '2024-12-20' },
  { name: 'Vanguard S&P 500 ETF', ticker: 'VOO', logo: 'https://logo.clearbit.com/vanguard.com', type: 'ETF', sector: 'Indice S&P 500', geo: 'Amérique du Nord', nextDividendDate: '2024-12-23' },
  { name: 'Invesco QQQ Trust', ticker: 'QQQ', logo: 'https://logo.clearbit.com/invesco.com', type: 'ETF', sector: 'Indice Nasdaq 100', geo: 'Amérique du Nord', nextDividendDate: '2024-12-20' },
  { name: 'iShares NASDAQ 100 UCITS ETF', ticker: 'SXRV.DE', logo: 'https://logo.clearbit.com/blackrock.com', type: 'ETF', sector: 'Indice Nasdaq 100', geo: 'Amérique du Nord' },
  { name: 'Lyxor Nasdaq 100 UCITS ETF', ticker: 'UST.PA', logo: 'https://logo.clearbit.com/lyxor.com', type: 'ETF', sector: 'Indice Nasdaq 100', geo: 'Amérique du Nord' },
  { name: 'SPDR Dow Jones Industrial Average ETF', ticker: 'DIA', logo: 'https://logo.clearbit.com/ssga.com', type: 'ETF', sector: 'Indice Dow Jones', geo: 'Amérique du Nord', nextDividendDate: '2024-12-20' },
  { name: 'iShares MSCI World UCITS ETF', ticker: 'IWDA.AS', logo: 'https://logo.clearbit.com/blackrock.com', type: 'ETF', sector: 'Indice Monde', geo: 'Monde' },
  { name: 'Amundi MSCI World UCITS ETF', ticker: 'CW8.PA', logo: 'https://logo.clearbit.com/amundi.com', type: 'ETF', sector: 'Indice Monde', geo: 'Monde' },
  { name: 'Vanguard FTSE All-World UCITS ETF', ticker: 'VWCE.DE', logo: 'https://logo.clearbit.com/vanguard.com', type: 'ETF', sector: 'Indice Monde', geo: 'Monde', nextDividendDate: '2024-12-18' },
  { name: 'Vanguard Total Stock Market ETF', ticker: 'VTI', logo: 'https://logo.clearbit.com/vanguard.com', type: 'ETF', sector: 'Indice US Large Cap', geo: 'Amérique du Nord', nextDividendDate: '2024-12-23' },
  { name: 'iShares Russell 2000 ETF', ticker: 'IWM', logo: 'https://logo.clearbit.com/blackrock.com', type: 'ETF', sector: 'Indice US Small Cap', geo: 'Amérique du Nord' },
  
  // --- Indices Européens ---
  { name: 'Lyxor CAC 40 UCITS ETF', ticker: 'CAC.PA', logo: 'https://logo.clearbit.com/lyxor.com', type: 'ETF', sector: 'Indice France', geo: 'Europe' },
  { name: 'Amundi CAC 40 UCITS ETF', ticker: 'C40.PA', logo: 'https://logo.clearbit.com/amundi.com', type: 'ETF', sector: 'Indice France', geo: 'Europe' },
  { name: 'iShares Core DAX UCITS ETF (DE)', ticker: 'EXS1.DE', logo: 'https://logo.clearbit.com/blackrock.com', type: 'ETF', sector: 'Indice Allemagne', geo: 'Europe' },
  { name: 'iShares Core FTSE 100 UCITS ETF', ticker: 'ISF.L', logo: 'https://logo.clearbit.com/blackrock.com', type: 'ETF', sector: 'Indice UK', geo: 'Europe' },
  { name: 'iShares Core MSCI Europe UCITS ETF', ticker: 'IMEU.AS', logo: 'https://logo.clearbit.com/blackrock.com', type: 'ETF', sector: 'Indice Europe', geo: 'Europe' },
  
  // --- Indices Marchés Émergents & Asie ---
  { name: 'iShares MSCI Emerging Markets ETF', ticker: 'EEM', logo: 'https://logo.clearbit.com/blackrock.com', type: 'ETF', sector: 'Marchés Émergents', geo: 'Marchés Émergents' },
  { name: 'Vanguard FTSE Emerging Markets ETF', ticker: 'VWO', logo: 'https://logo.clearbit.com/vanguard.com', type: 'ETF', sector: 'Marchés Émergents', geo: 'Marchés Émergents' },
  { name: 'iShares China Large-Cap ETF', ticker: 'FXI', logo: 'https://logo.clearbit.com/blackrock.com', type: 'ETF', sector: 'Indice Chine', geo: 'Asie' },
  { name: 'iShares Nikkei 225 UCITS ETF', ticker: 'CNKY.DE', logo: 'https://logo.clearbit.com/blackrock.com', type: 'ETF', sector: 'Indice Japon', geo: 'Asie' },

  // --- ETFs Thématiques & Sectoriels ---
  { name: 'SPDR Gold Shares', ticker: 'GLD', logo: 'https://logo.clearbit.com/ssga.com', type: 'ETF', sector: 'Matières Premières', geo: 'Monde' },
  { name: 'iShares Gold Trust', ticker: 'IAU', logo: 'https://logo.clearbit.com/blackrock.com', type: 'ETF', sector: 'Matières Premières', geo: 'Monde' },
  { name: 'ARK Innovation ETF', ticker: 'ARKK', logo: 'https://logo.clearbit.com/ark-invest.com', type: 'ETF', sector: 'Technologie Disruptive', geo: 'Monde' },
  { name: 'Global X Lithium & Battery Tech ETF', ticker: 'LIT', logo: 'https://logo.clearbit.com/globalxetfs.com', type: 'ETF', sector: 'Énergies Renouvelables', geo: 'Monde' },
  { name: 'iShares Global Clean Energy ETF', ticker: 'ICLN', logo: 'https://logo.clearbit.com/blackrock.com', type: 'ETF', sector: 'Énergies Renouvelables', geo: 'Monde' },
  { name: 'Invesco Solar ETF', ticker: 'TAN', logo: 'https://logo.clearbit.com/invesco.com', type: 'ETF', sector: 'Énergies Renouvelables', geo: 'Monde' },
  { name: 'iShares U.S. Real Estate ETF', ticker: 'IYR', logo: 'https://logo.clearbit.com/blackrock.com', type: 'ETF', sector: 'Immobilier', geo: 'Amérique du Nord' },
  { name: 'Vanguard Information Technology ETF', ticker: 'VGT', logo: 'https://logo.clearbit.com/vanguard.com', type: 'ETF', sector: 'Technologie', geo: 'Amérique du Nord' },
  { name: 'Health Care Select Sector SPDR Fund', ticker: 'XLV', logo: 'https://logo.clearbit.com/ssga.com', type: 'ETF', sector: 'Santé', geo: 'Amérique du Nord' },
  { name: 'Financial Select Sector SPDR Fund', ticker: 'XLF', logo: 'https://logo.clearbit.com/ssga.com', type: 'ETF', sector: 'Finance', geo: 'Amérique du Nord' },
  { name: 'iShares U.S. Aerospace & Defense ETF', ticker: 'ITA', logo: 'https://logo.clearbit.com/blackrock.com', type: 'ETF', sector: 'Aérospatiale & Défense', geo: 'Amérique du Nord' },
  { name: 'VanEck Semiconductor ETF', ticker: 'SMH', logo: 'https://logo.clearbit.com/vaneck.com', type: 'ETF', sector: 'Semi-conducteurs', geo: 'Monde' },
  { name: 'First Trust NASDAQ Cybersecurity ETF', ticker: 'CIBR', logo: 'https://logo.clearbit.com/ftportfolios.com', type: 'ETF', sector: 'Cybersécurité', geo: 'Monde' },
  { name: 'Global X Robotics & Artificial Intelligence ETF', ticker: 'BOTZ', logo: 'https://logo.clearbit.com/globalxetfs.com', type: 'ETF', sector: 'Robotique & IA', geo: 'Monde' },
  { name: 'iShares Automation & Robotics UCITS ETF', ticker: 'RBOT.L', logo: 'https://logo.clearbit.com/blackrock.com', type: 'ETF', sector: 'Robotique & IA', geo: 'Monde' },
  { name: 'First Trust Cloud Computing ETF', ticker: 'SKYY', logo: 'https://logo.clearbit.com/ftportfolios.com', type: 'ETF', sector: 'Cloud Computing', geo: 'Monde' },
  { name: 'iShares Biotechnology ETF', ticker: 'IBB', logo: 'https://logo.clearbit.com/blackrock.com', type: 'ETF', sector: 'Biotechnologie', geo: 'Amérique du Nord' },
  { name: 'Invesco Water Resources ETF', ticker: 'PHO', logo: 'https://logo.clearbit.com/invesco.com', type: 'ETF', sector: 'Eau', geo: 'Amérique du Nord' },
  { name: 'Amundi S&P Global Luxury UCITS ETF', ticker: 'GLUX.MI', logo: 'https://logo.clearbit.com/amundi.com', type: 'ETF', sector: 'Luxe', geo: 'Monde' },
  { name: 'Global X Uranium ETF', ticker: 'URA', logo: 'https://logo.clearbit.com/globalxetfs.com', type: 'ETF', sector: 'Uranium', geo: 'Monde' },
  { name: 'ETFMG Alternative Harvest ETF', ticker: 'MJ', logo: 'https://logo.clearbit.com/etfmg.com', type: 'ETF', sector: 'Cannabis', geo: 'Monde' },
  { name: 'iShares ESG Aware MSCI USA ETF', ticker: 'ESGU', logo: 'https://logo.clearbit.com/blackrock.com', type: 'ETF', sector: 'ESG / ISR', geo: 'Amérique du Nord' },
  { name: 'Roundhill Ball Metaverse ETF', ticker: 'METV', logo: 'https://logo.clearbit.com/roundhillinvestments.com', type: 'ETF', sector: 'Métavers', geo: 'Monde' },
  { name: 'iShares Digitalisation UCITS ETF', ticker: 'DGTL.L', logo: 'https://logo.clearbit.com/blackrock.com', type: 'ETF', sector: 'Digitalisation', geo: 'Monde' },
  { name: 'VanEck Gaming ETF', ticker: 'ESPO', logo: 'https://logo.clearbit.com/vaneck.com', type: 'ETF', sector: 'Jeux Vidéo & eSports', geo: 'Monde' },
  { name: 'iShares TIPS Bond ETF', ticker: 'TIP', logo: 'https://logo.clearbit.com/blackrock.com', type: 'ETF', sector: 'Obligations', geo: 'Amérique du Nord' },
  { name: 'Vanguard Total Bond Market ETF', ticker: 'BND', logo: 'https://logo.clearbit.com/vanguard.com', type: 'ETF', sector: 'Obligations', geo: 'Amérique du Nord' },
];

interface Stock {
  name: string;
  ticker: string;
  logo: string;
  type: string;
  sector: string;
  geo: string;
  nextEarningsDate?: string;
  nextDividendDate?: string;
}

interface AddPositionFormProps {
  onAddPosition: (position: Omit<PortfolioPosition, 'id'>) => void;
}

const IconPlaceholder: React.FC = () => (
    <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
);

const AddPositionForm: React.FC<AddPositionFormProps> = ({ onAddPosition }) => {
  const [name, setName] = useState('');
  const [totalCost, setTotalCost] = useState('');
  const [currentValue, setCurrentValue] = useState('');
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [searchResults, setSearchResults] = useState<Stock[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);
  const debounceTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      // Nettoyer le timer de debounce lors du démontage du composant
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);
  
  useEffect(() => {
    if (isDropdownOpen && activeIndex >= 0 && dropdownRef.current) {
        const activeElement = dropdownRef.current.children[activeIndex] as HTMLLIElement;
        if (activeElement) {
            activeElement.scrollIntoView({
                block: 'nearest',
            });
        }
    }
  }, [activeIndex, isDropdownOpen]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setName(query);
    setSelectedStock(null);
    setActiveIndex(-1);

    // Annuler le timeout précédent
    if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
    }

    if (query.trim() === '') {
      setSearchResults([]);
      setIsDropdownOpen(false);
    } else {
      // Définir un nouveau timeout
      debounceTimeoutRef.current = window.setTimeout(() => {
        const filteredStocks = mockData.filter(stock =>
          stock.name.toLowerCase().includes(query.toLowerCase()) ||
          stock.ticker.toLowerCase().includes(query.toLowerCase())
        );
        setSearchResults(filteredStocks);
        setIsDropdownOpen(true);
      }, 300); // Délai de 300ms
    }
  };

  const handleSelectStock = (stock: Stock) => {
    setName(stock.name);
    setSelectedStock(stock);
    setIsDropdownOpen(false);
    setSearchResults([]);
    setActiveIndex(-1);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isDropdownOpen || searchResults.length === 0) return;
    
    if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex(prev => (prev < searchResults.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex(prev => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter') {
        e.preventDefault();
        if (activeIndex >= 0 && activeIndex < searchResults.length) {
            handleSelectStock(searchResults[activeIndex]);
        }
    } else if (e.key === 'Escape') {
        setIsDropdownOpen(false);
        setActiveIndex(-1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cost = parseFloat(totalCost);
    const value = parseFloat(currentValue);

    if (name && selectedStock && !isNaN(cost) && !isNaN(value) && cost >= 0 && value >= 0) {
      onAddPosition({ 
        name, 
        totalCost: cost, 
        currentValue: value, 
        iconUrl: selectedStock.logo,
        assetType: selectedStock.type,
        sector: selectedStock.sector,
        geo: selectedStock.geo,
        nextEarningsDate: selectedStock.nextEarningsDate,
        nextDividendDate: selectedStock.nextDividendDate,
      });
      setName('');
      setTotalCost('');
      setCurrentValue('');
      setSelectedStock(null);
      setActiveIndex(-1);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 h-full flex flex-col">
      <div className="space-y-4">
        <div className="relative" ref={searchContainerRef}>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
            Nom de l'action / Ticker
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={handleNameChange}
            onKeyDown={handleKeyDown}
            onFocus={() => name.trim() && searchResults.length > 0 && setIsDropdownOpen(true)}
            placeholder="Rechercher (Ex: Apple, AAPL, CW8)"
            required
            autoComplete="off"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
            aria-autocomplete="list"
            aria-controls={isDropdownOpen && searchResults.length > 0 ? "stock-results" : undefined}
            aria-activedescendant={activeIndex >= 0 ? `stock-option-${activeIndex}` : undefined}
          />
          {isDropdownOpen && searchResults.length > 0 && (
            <div className="absolute z-10 w-full rounded-lg mt-1 max-h-60 overflow-y-auto shadow-lg dashboard-card p-1 bg-[#101831]/95 backdrop-blur-2xl">
              <ul id="stock-results" role="listbox" ref={dropdownRef}>
                {searchResults.map((stock, index) => (
                  <li
                    id={`stock-option-${index}`}
                    key={stock.ticker}
                    role="option"
                    aria-selected={index === activeIndex}
                    className={`px-3 py-2 text-white cursor-pointer flex items-center space-x-3 rounded-md transition-colors ${index === activeIndex ? 'bg-emerald-600' : 'hover:bg-white/10'}`}
                    onClick={() => handleSelectStock(stock)}
                    onMouseEnter={() => setActiveIndex(index)}
                  >
                    <img src={stock.logo} alt={stock.name} className="w-6 h-6 rounded-full bg-white p-0.5" />
                    <span>{stock.name} ({stock.ticker})</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div>
           <label className="block text-sm font-medium text-gray-300 mb-2">
            Icône de l'action
          </label>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-black/20 border border-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
              {selectedStock?.logo ? <img src={selectedStock.logo} alt="Logo de l'action" className="w-full h-full object-contain p-2 rounded-lg" /> : <IconPlaceholder />}
            </div>
            <p className="text-sm text-gray-400">Le logo apparaîtra ici après la sélection.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="totalCost" className="block text-sm font-medium text-gray-300 mb-1">
              Coût total (€)
            </label>
            <input
              type="number"
              id="totalCost"
              value={totalCost}
              onChange={(e) => setTotalCost(e.target.value)}
              placeholder="1500.50"
              required
              min="0"
              step="0.01"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
            />
          </div>
          <div>
            <label htmlFor="currentValue" className="block text-sm font-medium text-gray-300 mb-1">
              Valeur actuelle (€)
            </label>
            <input
              type="number"
              id="currentValue"
              value={currentValue}
              onChange={(e) => setCurrentValue(e.target.value)}
              placeholder="1800.75"
              required
              min="0"
              step="0.01"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
            />
          </div>
        </div>
      </div>
      <div className="mt-auto pt-4">
        <button
          type="submit"
          disabled={!selectedStock}
          className="w-full btn-glass btn-primary py-3"
        >
          Ajouter la Position
        </button>
      </div>
    </form>
  );
};

export default AddPositionForm;