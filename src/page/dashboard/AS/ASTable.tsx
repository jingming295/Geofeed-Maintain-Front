"use client"
import { Check, X } from "lucide-react";

import * as React from "react"
import
{
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import
{
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"


const data: ASData[] = [
    {
        ASNumber: "AS12345",
        Prefixes: 100,
        PrefixesWithGeolocation: 80,
        Status: true,
    },
    {
        ASNumber: "AS67890",
        Prefixes: 150,
        PrefixesWithGeolocation: 120,
        Status: true,
    },
    {
        ASNumber: "AS67891",
        Prefixes: 153,
        PrefixesWithGeolocation: 110,
        Status: false,
    },
];

type ASData = {
    ASNumber: string;
    Prefixes: number;
    PrefixesWithGeolocation: number;
    Status: boolean;
};

const columns: ColumnDef<ASData>[] = [
    {
        accessorKey: "ASNumber",
        header: ({ column }) => (
            <Button
                className="w-full"
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                AS
                <ArrowUpDown />
            </Button>
        ),
        cell: ({ row }) => <div className="flex items-center justify-center">{row.getValue("ASNumber")}</div>,
    },
    {
        accessorKey: "Prefixes",
        header: ({ column }) => (
            <Button
                variant="ghost"
                className="w-full"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Prefixes
                <ArrowUpDown />
            </Button>
        ),
        cell: ({ row }) => <div className="flex items-center justify-center">{row.getValue("Prefixes")}</div>,
    },
    {
        accessorKey: "PrefixesWithGeolocation",
        header: ({ column }) => (
            <Button
                variant="ghost"
                className="w-full"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Prefixes with Geolocation
                <ArrowUpDown />
            </Button>
        ),
        cell: ({ row }) => <div className="flex items-center justify-center">{row.getValue("PrefixesWithGeolocation")}</div>,
    },
    {
        accessorKey: "Status",
        header: ({ column }) => (
            <Button
                variant="ghost"
                className="w-full"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Status
                <ArrowUpDown />
            </Button>
        ),
        cell: ({ row }) => (
            <div className="flex items-center justify-center">
                {row.getValue("Status") ? <Check /> : <X />}
            </div>
        ),
    },
];

interface DataTableProps
{
    table: import("@tanstack/table-core").Table<ASData>;
}

class DataTable extends React.Component<DataTableProps>
{
    render(): React.ReactNode
    {
        const { table } = this.props
        return (
            <div className="w-full">
                <div className="flex items-center py-4">
                    <Input
                        placeholder="Filter AS Number..."
                        value={(table.getColumn("ASNumber")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("ASNumber")?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm"
                    />
                    {/* <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="ml-auto">
                                Columns <ChevronDown />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {table
                                .getAllColumns()
                                .filter((column) => column.getCanHide())
                                .map((column) =>
                                {
                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) =>
                                                column.toggleVisibility(!!value)
                                            }
                                        >
                                            {column.id}
                                        </DropdownMenuCheckboxItem>
                                    )
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu> */}
                </div>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) =>
                                    {
                                        return (
                                            <TableHead key={header.id}>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                            </TableHead>
                                        )
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-24 text-center"
                                    >
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <div className="flex items-center justify-end space-x-2 py-4">
                    <div className="space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>
        )
    }
}
















function withTable<T>(Component: React.ComponentType<T>)
{
    return (props: Omit<T, 'table'>) =>
    {
        const [sorting, setSorting] = React.useState<SortingState>([])
        const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
            []
        )
        const [columnVisibility, setColumnVisibility] =
            React.useState<VisibilityState>({})
        const [rowSelection, setRowSelection] = React.useState({})


        const table = useReactTable({
            data,
            columns,
            onSortingChange: setSorting,
            onColumnFiltersChange: setColumnFilters,
            getCoreRowModel: getCoreRowModel(),
            getPaginationRowModel: getPaginationRowModel(),
            getSortedRowModel: getSortedRowModel(),
            getFilteredRowModel: getFilteredRowModel(),
            onColumnVisibilityChange: setColumnVisibility,
            onRowSelectionChange: setRowSelection,
            state: {
                sorting,
                columnFilters,
                columnVisibility,
                rowSelection,
            },
        })

        return <Component {...(props as T)} table={table} />;
    };
}

const DataTableWithTable = withTable(DataTable);

export default DataTableWithTable