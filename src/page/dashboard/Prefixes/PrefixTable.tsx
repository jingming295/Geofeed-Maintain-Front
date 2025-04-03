"use client";
import * as React from "react";
import
{
    ColumnDef,
    ColumnFiltersState,
    PaginationState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import
{
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { PrefixDataWithAction } from "@/types/Prefix";

const columns: ColumnDef<PrefixDataWithAction>[] = [
    {
        accessorKey: "action",
        header: () => (<div > </div>),
        cell: ({ row }) => (
            <div className="flex items-center justify-center">
                <Button onClick={row.getValue('action')} variant="outline" size="sm" className=" max-h-[23px] max-w-[30px]">
                    <Pencil />
                </Button>
            </div>
        )
    },
    {
        accessorKey: "Prefix",
        header: ({ column }) => (
            <div className="flex gap-2 items-center w-full">
                <span className="text-left select-none">Prefix</span>
                <ArrowUpDown
                    size={16}
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                    className="cursor-pointer transition-transform duration-150 ease-in-out active:scale-90"
                />
            </div>
        ),
        cell: ({ row }) => (
            <div className="flex items-center min-w-[150px] max-w-[150px]">
                {row.getValue("Prefix")}
            </div>
        ),
    },
    {
        accessorKey: "Country",
        header: ({ column }) => (
            <div className="flex gap-2 items-center w-full">
                <span className="text-left select-none">Country</span>
                <ArrowUpDown
                    size={16}

                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                    className="cursor-pointer transition-transform duration-150 ease-in-out active:scale-90"
                />
            </div>
        ),
        cell: ({ row }) => (
            <div className="flex items-center">
                {row.getValue("Country") || "-"}
            </div>
        ),
    },
    {
        accessorKey: "SubDivisions",
        header: ({ column }) => (
            <div className="flex gap-2 items-center w-full">
                <span className="text-left select-none">Subdivisions</span>
                <ArrowUpDown
                    size={16}

                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                    className="cursor-pointer transition-transform duration-150 ease-in-out active:scale-90"
                />
            </div>
        ),
        cell: ({ row }) => (
            <div className="flex items-center">
                {row.getValue("SubDivisions") || "-"}
            </div>
        ),
    },
    {
        accessorKey: "City",
        header: ({ column }) => (
            <div className="flex gap-2 items-center w-full">
                <span className="text-left select-none">City</span>
                <ArrowUpDown
                    size={16}

                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                    className="cursor-pointer transition-transform duration-150 ease-in-out active:scale-90"
                />
            </div>
        ),
        cell: ({ row }) => (
            <div className="flex items-center">
                {row.getValue("City") || "-"}
            </div>
        ),
    },
    {
        accessorKey: "ZipCode",
        header: ({ column }) => (
            <div className="flex gap-2 items-center w-full">
                <span className="text-left select-none">Zipcode</span>
                <ArrowUpDown
                    size={16}

                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                    className="cursor-pointer transition-transform duration-150 ease-in-out active:scale-90"
                />
            </div>
        ),
        cell: ({ row }) => (
            <div className="flex items-center">
                {row.getValue("ZipCode") || "-"}
            </div>
        ),
    },
];



interface DataTableProps
{
    table: import("@tanstack/table-core").Table<PrefixDataWithAction>;
    prefixData: PrefixDataWithAction[]; // Pass data from parent
}

class PrefixTable extends React.Component<DataTableProps>
{
    constructor(props: DataTableProps)
    {
        super(props);
    }

    render(): React.ReactNode
    {
        const { table } = this.props;
        return (
            <div className="w-full h-full p-1">
                <div className="flex items-center py-4">
                    <Input
                        placeholder="Filter Prefix..."
                        value={
                            (table.getColumn("Prefix")?.getFilterValue() as string) ??
                            ""
                        }
                        onChange={(event) =>
                            table
                                .getColumn("Prefix")
                                ?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm"
                    />
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
                                                        header.column.columnDef
                                                            .header,
                                                        header.getContext()
                                                    )}
                                            </TableHead>
                                        );
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
                    <div className="flex-1 text-sm text-muted-foreground">
                        {`Displaying rows ${table.getState().pagination.pageIndex *
                            table.getState().pagination.pageSize +
                            1} - ${Math.min(
                                (table.getState().pagination.pageIndex + 1) *
                                table.getState().pagination.pageSize,
                                table.getFilteredRowModel().rows.length
                            )} of ${table.getFilteredRowModel().rows.length} total.`}
                    </div>
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
        );
    }
}

function withTable<T extends { prefixData: PrefixDataWithAction[] }>(
    Component: React.ComponentType<
        T & { table: import("@tanstack/table-core").Table<PrefixDataWithAction> }
    >
)
{
    return (props: Omit<T, "table">) =>
    {
        const [sorting, setSorting] = React.useState<SortingState>([]);
        const [columnFilters, setColumnFilters] =
            React.useState<ColumnFiltersState>([]);
        const [columnVisibility, setColumnVisibility] =
            React.useState<VisibilityState>({});
        const [rowSelection, setRowSelection] = React.useState({});

        // 初始化分页状态
        const [pagination, setPagination] = React.useState<PaginationState>({
            pageIndex: 0,
            pageSize: 10, // 默认每页显示 10 行
        });

        const tableContainerRef = React.useRef<HTMLDivElement>(null);

        React.useEffect(() =>
        {
            const calculatePageSize = () =>
            {
                if (tableContainerRef.current)
                {
                    const containerHeight = tableContainerRef.current.offsetHeight;
                    const headerHeight = 40;
                    const rowHeight = 40;
                    const availableHeight = containerHeight - headerHeight - 68 - 64;
                    const dynamicPageSize = Math.floor(availableHeight / rowHeight);
                    setPagination((prev) => ({
                        ...prev,
                        pageSize: dynamicPageSize, // 更新每页行数
                    }));
                }
            };

            calculatePageSize(); // 初次加载时计算
            window.addEventListener("resize", calculatePageSize); // 窗口大小变化时重新计算
            return () =>
            {
                window.removeEventListener("resize", calculatePageSize);
            };
        }, []);

        const table = useReactTable({
            data: props.prefixData, // 使用传入的数据
            columns,
            onSortingChange: setSorting,
            onPaginationChange: setPagination,
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
                pagination, // 使用动态分页状态
            },
        });

        return (
            <div ref={tableContainerRef} className="h-full">
                <Component {...(props as T)} table={table} />
            </div>
        );
    };
}

const PrefixTablewithTable = withTable(PrefixTable);

export default PrefixTablewithTable;
