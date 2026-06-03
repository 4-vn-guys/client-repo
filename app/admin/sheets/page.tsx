'use client';

import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { 
  Database, 
  Search, 
  RefreshCw, 
  Info, 
  Table as TableIcon, 
  ChevronRight,
  Download,
  AlertCircle,
  FileSpreadsheet
} from 'lucide-react';

import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Card, CardContent } from '@/shared/ui/card';
import { 
  fetchPlatformTables, 
  fetchPlatformTableRows 
} from '@/entities/admin/api/platform-api';
import { cn } from '@/shared/lib/utils';

export default function AdminSheetsPage() {
  const [selectedTable, setSelectedTable] = useState<string>('users');
  const [searchInput, setSearchInput] = useState<string>('');
  const [search, setSearch] = useState<string>('');

  // Debounce search input changes
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearch(searchInput);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchInput]);

  // Fetch the whitelisted table names from backend
  const { 
    data: tables = [], 
    isLoading: isLoadingTables, 
    refetch: refetchTables 
  } = useQuery({
    queryKey: ['admin-platform', 'tables-list'],
    queryFn: fetchPlatformTables,
  });

  // Compute active table based on whitelisted selection
  const activeTable = selectedTable && tables.includes(selectedTable) ? selectedTable : (tables[0] || 'users');

  // Fetch dynamic table metadata & rows from backend
  const { 
    data: tableData, 
    isLoading: isLoadingRows, 
    isFetching: isFetchingRows,
    refetch: refetchRows,
    error 
  } = useQuery({
    queryKey: ['admin-platform', 'table-rows', activeTable, search],
    queryFn: () => fetchPlatformTableRows(activeTable, search),
    enabled: !!activeTable,
  });

  const columns = tableData?.columns ?? [];
  const rows = tableData?.rows ?? [];

  // Helper to format values elegantly in the spreadsheet cells
  const renderCellValue = (value: unknown, columnName: string) => {
    if (value === null || value === undefined) {
      return <span className="text-muted-foreground/40 italic font-mono text-xs">null</span>;
    }

    if (typeof value === 'boolean') {
      return (
        <Badge variant={value ? 'default' : 'secondary'} className="px-1.5 py-0 text-[10px]">
          {String(value)}
        </Badge>
      );
    }

    if (typeof value === 'object') {
      return (
        <code className="text-[10px] text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/30 px-1 py-0.5 rounded font-mono truncate max-w-[200px] inline-block" title={JSON.stringify(value)}>
          {JSON.stringify(value)}
        </code>
      );
    }

    // Format timestamps nicely
    if (columnName.toLowerCase().endsWith('at') && typeof value === 'string' && !isNaN(Date.parse(value))) {
      const date = new Date(value);
      return (
        <span className="font-mono text-xs text-muted-foreground whitespace-nowrap" title={value}>
          {date.toLocaleDateString()} {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      );
    }

    // Monospace styling for IDs, UUIDs, hashes
    if (
      columnName === 'id' || 
      columnName.toLowerCase().endsWith('id') || 
      columnName === 'password' ||
      columnName.toLowerCase().endsWith('code') || 
      (typeof value === 'string' && value.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i))
    ) {
      return (
        <span className="font-mono text-xs font-medium text-blue-600 dark:text-blue-400 select-all" title={String(value)}>
          {String(value).slice(0, 8)}...
        </span>
      );
    }

    return <span className="text-xs truncate max-w-[250px] inline-block" title={String(value)}>{String(value)}</span>;
  };

  const handleExportCSV = () => {
    if (rows.length === 0) return;
    
    const headers = columns.join(',');
    const csvRows = rows.map(row => 
      columns.map(col => {
        const val = row[col];
        if (val === null || val === undefined) return '';
        const str = typeof val === 'object' ? JSON.stringify(val) : String(val);
        return `"${str.replace(/"/g, '""')}"`;
      }).join(',')
    );
    
    const csvContent = [headers, ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `bookmycourt_${activeTable}_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 py-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <FileSpreadsheet className="size-6 text-primary" />
            Interactive Data Sheets
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Live spreadsheet-style explorer for direct querying, filtering, and analysis of core database tables.
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              refetchTables();
              refetchRows();
            }}
            icon={<RefreshCw className={cn("size-3.5", (isLoadingTables || isFetchingRows) && "animate-spin")} />}
          >
            Refresh
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleExportCSV}
            disabled={rows.length === 0}
            icon={<Download className="size-3.5" />}
          >
            Export CSV
          </Button>
        </div>
      </div>

      {/* Modern Guideline Banner */}
      <Card className="border-primary/20 bg-primary/5 dark:bg-primary/5 gap-0 overflow-hidden shadow-xs">
        <CardContent className="p-4 flex gap-3.5">
          <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Info className="size-5 text-primary" />
          </div>
          <div className="space-y-1.5 flex-1">
            <h4 className="text-sm font-semibold text-primary">Interactive Seed & Live Database Integration Guide</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              This interactive spreadsheet grid connects in real-time to the PostgreSQL database. There are no frontend mockups here. To see the platform&apos;s analytical service engine calculate performance metrics, run the backend seeder command below to populate 30 days of comprehensive, dynamic transactions:
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mt-2">
              <code className="bg-muted px-2.5 py-1 rounded text-[11px] font-mono select-all flex-1 text-muted-foreground border">
                cd book-my-court && bun run seed
              </code>
              <Badge variant="outline" className="w-fit text-[10px] py-0.5 border-dashed">
                Seeds users, branches, courts, bookings, payments, and pro shop goods orders.
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-6">
        
        {/* Table Whitelist Sidebar */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">
            Available Tables ({tables.length})
          </h3>
          <div className="flex flex-col gap-1">
            {isLoadingTables ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-9 w-full bg-muted animate-pulse rounded-md" />
              ))
            ) : (
              tables.map((tName) => {
                const isSelected = activeTable === tName;
                return (
                  <button
                    key={tName}
                    onClick={() => {
                      setSelectedTable(tName);
                      setSearchInput('');
                    }}
                    className={cn(
                      "flex items-center justify-between w-full text-left px-3 py-2 rounded-md text-sm transition-all border border-transparent",
                      isSelected 
                        ? "bg-primary text-primary-foreground font-semibold shadow-xs" 
                        : "hover:bg-muted/70 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <TableIcon className="size-4 shrink-0" />
                      <span className="font-mono text-xs">{tName}</span>
                    </div>
                    {isSelected && <ChevronRight className="size-4" />}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Dynamic Spreadsheet Data Grid */}
        <div className="space-y-4 min-w-0">
          
          {/* Filters & Summary Bar */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder={`Search columns in '${activeTable}'...`}
                className="pl-9 h-9 w-full"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-3 shrink-0 text-xs font-medium text-muted-foreground">
              {isFetchingRows && (
                <span className="flex items-center gap-1.5 text-primary">
                  <RefreshCw className="size-3 animate-spin" /> Querying...
                </span>
              )}
              <span>Columns: <strong className="text-foreground">{columns.length}</strong></span>
              <span>Rows: <strong className="text-foreground">{rows.length}</strong></span>
            </div>
          </div>

          {/* Interactive Grid Container */}
          <Card className="gap-0 overflow-hidden border">
            <div className="overflow-x-auto overflow-y-auto max-h-[600px] scrollbar-thin">
              {isLoadingRows ? (
                <div className="flex flex-col items-center justify-center p-24 gap-3 text-center">
                  <Database className="size-8 text-primary animate-pulse" />
                  <span className="text-sm font-medium text-muted-foreground">Fetching records from PostgreSQL...</span>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center p-16 gap-3 text-center text-destructive">
                  <AlertCircle className="size-8" />
                  <h4 className="font-semibold text-sm">Failed to Load Table Data</h4>
                  <p className="text-xs text-muted-foreground max-w-sm">{(error as Error)?.message || "Internal database connection failure"}</p>
                </div>
              ) : rows.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-24 gap-2 text-center">
                  <Database className="size-8 text-muted-foreground/30" />
                  <h4 className="font-semibold text-sm text-muted-foreground">No Records Found</h4>
                  <p className="text-xs text-muted-foreground/75 max-w-xs">
                    {search ? `No records in '${activeTable}' match your search query.` : `This table currently contains 0 records.`}
                  </p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse select-none">
                  <thead>
                    <tr className="bg-muted/80 border-b border-border text-xs text-muted-foreground sticky top-0 z-10">
                      {/* Row numbering column */}
                      <th className="px-3 py-2 w-10 text-center font-mono font-normal border-r border-border bg-muted/95 select-none text-[10px]">
                        #
                      </th>
                      {columns.map((colName) => (
                        <th 
                          key={colName} 
                          className="px-4 py-2 font-mono font-medium tracking-tight border-r border-border hover:bg-muted whitespace-nowrap text-left text-foreground bg-muted/95"
                        >
                          {colName}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, rowIndex) => (
                      <tr 
                        key={row.id ?? rowIndex} 
                        className="hover:bg-muted/40 transition-colors border-b border-border/60 text-xs font-normal"
                      >
                        {/* Row numbering */}
                        <td className="px-3 py-2 text-center font-mono text-[10px] text-muted-foreground border-r border-border/60 bg-muted/10">
                          {rowIndex + 1}
                        </td>
                        {columns.map((colName) => (
                          <td 
                            key={colName} 
                            className="px-4 py-2 border-r border-border/60 align-middle max-w-[300px] overflow-hidden"
                          >
                            {renderCellValue(row[colName], colName)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
