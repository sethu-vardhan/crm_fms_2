import React, { useState } from 'react';
import { X, FileSpreadsheet, Download, Copy, Check, FileCode, CheckCircle2 } from 'lucide-react';
import { InvoiceRecord } from '../../types';

interface TallyExportModalProps {
  isOpen?: boolean;
  onClose: () => void;
  invoices: InvoiceRecord[];
  clientGstin?: string;
  clientName?: string;
}

export const TallyExportModal: React.FC<TallyExportModalProps> = ({
  isOpen = true,
  onClose,
  invoices = [],
  clientGstin,
  clientName,
}) => {
  if (isOpen === false) return null;

  const [format, setFormat] = useState<'xml' | 'csv'>('xml');
  const [copied, setCopied] = useState(false);

  // Generate real Tally Prime XML structure for Sales Vouchers
  const generateTallyXml = () => {
    return `<?xml version="1.0" encoding="UTF-8"?>
<ENVELOPE>
  <HEADER>
    <TALLYREQUEST>Import Data</TALLYREQUEST>
  </HEADER>
  <BODY>
    <IMPORTDATA>
      <REQUESTDESC>
        <REPORTNAME>Vouchers</REPORTNAME>
      </REQUESTDESC>
      <REQUESTDATA>
${invoices
  .map(
    (inv) => `        <TALLYMESSAGE xmlns:UDF="TallyUDF">
          <VOUCHER VCHTYPE="Sales" ACTION="Create" OBJVIEW="Accounting Voucher View">
            <DATE>${inv.date.replace(/-/g, '')}</DATE>
            <VOUCHERTYPENAME>Works Contract Sales</VOUCHERTYPENAME>
            <VOUCHERNUMBER>${inv.invoiceNo}</VOUCHERNUMBER>
            <PARTYLEDGERNAME>Maa Mahamaya Industries Limited</PARTYLEDGERNAME>
            <PARTYNAME>Maa Mahamaya Industries Limited (MMIL)</PARTYNAME>
            <BASICBUYERADDRESS>Kothavalasa, Vizianagaram Dist., AP</BASICBUYERADDRESS>
            <PARTYGSTIN>37AABCM8821L1Z4</PARTYGSTIN>
            <PLACEOFSUPPLY>37-Andhra Pradesh</PLACEOFSUPPLY>
            <ALLLEDGERENTRIES.LIST>
              <LEDGERNAME>Maa Mahamaya Industries Limited</LEDGERNAME>
              <ISDEEMEDPOSITIVE>Yes</ISDEEMEDPOSITIVE>
              <AMOUNT>-${inv.netPayable}</AMOUNT>
            </ALLLEDGERENTRIES.LIST>
            <ALLLEDGERENTRIES.LIST>
              <LEDGERNAME>Fabrication & Erection Works Contract Income</LEDGERNAME>
              <ISDEEMEDPOSITIVE>No</ISDEEMEDPOSITIVE>
              <AMOUNT>${inv.basicAmount}</AMOUNT>
            </ALLLEDGERENTRIES.LIST>
            <ALLLEDGERENTRIES.LIST>
              <LEDGERNAME>Output IGST 18%</LEDGERNAME>
              <ISDEEMEDPOSITIVE>No</ISDEEMEDPOSITIVE>
              <AMOUNT>${inv.gstAmount}</AMOUNT>
            </ALLLEDGERENTRIES.LIST>
            ${
              inv.retentionAmount > 0
                ? `<ALLLEDGERENTRIES.LIST>
              <LEDGERNAME>Retention Money Receivable</LEDGERNAME>
              <ISDEEMEDPOSITIVE>Yes</ISDEEMEDPOSITIVE>
              <AMOUNT>${inv.retentionAmount}</AMOUNT>
            </ALLLEDGERENTRIES.LIST>`
                : ''
            }
          </VOUCHER>
        </TALLYMESSAGE>`
  )
  .join('\n')}
      </REQUESTDATA>
    </IMPORTDATA>
  </BODY>
</ENVELOPE>`;
  };

  // Generate GST B2B CSV
  const generateGstCsv = () => {
    const headers = [
      'GSTIN/UIN of Recipient',
      'Receiver Name',
      'Invoice Number',
      'Invoice Date',
      'Invoice Value',
      'Place of Supply',
      'Reverse Charge',
      'Applicable % of Tax Rate',
      'Invoice Type',
      'E-Commerce GSTIN',
      'Rate',
      'Taxable Value',
      'Cess Amount',
    ].join(',');

    const rows = invoices.map((inv) =>
      [
        '37AABCM8821L1Z4',
        '"Maa Mahamaya Industries Limited"',
        inv.invoiceNo,
        inv.date,
        inv.netPayable,
        '37-Andhra Pradesh',
        'N',
        '',
        'Regular B2B',
        '',
        18,
        inv.basicAmount,
        0,
      ].join(',')
    );

    return [headers, ...rows].join('\n');
  };

  const currentContent = format === 'xml' ? generateTallyXml() : generateGstCsv();

  const handleCopy = () => {
    navigator.clipboard.writeText(currentContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const filename = format === 'xml' ? 'SethuWorks_TallyPrime_Export.xml' : 'SethuWorks_GST_B2B_Table4.csv';
    const blob = new Blob([currentContent], {
      type: format === 'xml' ? 'application/xml' : 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold flex items-center gap-2">
                Tally Prime & GST Ready Export
                <span className="text-[10px] bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-md font-semibold">
                  Section 5 Accounting Integration
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Direct export to Tally XML and Government GST Portal B2B schema for Indian SME contractors
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Format Selector */}
        <div className="px-6 pt-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFormat('xml')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border-b-2 transition-colors ${
                format === 'xml'
                  ? 'border-amber-500 text-slate-900 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              Tally Prime XML (Voucher Import)
            </button>
            <button
              onClick={() => setFormat('csv')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border-b-2 transition-colors ${
                format === 'csv'
                  ? 'border-amber-500 text-slate-900 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              GST Portal GSTR-1 (Table 4A B2B CSV)
            </button>
          </div>

          <div className="flex items-center gap-2 pb-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-700"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              Download {format.toUpperCase()}
            </button>
          </div>
        </div>

        {/* Code / Content Preview */}
        <div className="p-6 overflow-y-auto bg-slate-950 text-slate-200 font-mono text-[11px] leading-relaxed select-all">
          <pre className="whitespace-pre-wrap overflow-x-auto">{currentContent}</pre>
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1.5 text-slate-600">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Configured for 18% Works Contract GST + 5% Retention Ledger Accounting
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
