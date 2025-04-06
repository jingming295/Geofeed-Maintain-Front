"use client";

import React, { Component } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import
{
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import
{
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

interface InputComboBoxState
{
    open: boolean;
    addValue: string | null; // 用于存储 CommandInput 中的值
}

interface InputComboBoxProps
{
    items: {
        id: number;
        name: string;
    }[];
    selectedValue?: number | null; // 支持 null 作为默认值
    setValue: (value: number | null, name?: string) => void; // 选择值的回调
    handleAdd?: (value: string) => void; // 新增项的回调
    placeholder: string;
}

class InputComboBox extends Component<InputComboBoxProps, InputComboBoxState>
{
    constructor(props: InputComboBoxProps)
    {
        super(props);
        this.state = {
            open: false,
            addValue: null, // 初始值为 null
        };
    }

    setOpen = (open: boolean) =>
    {
        this.setState({ open });
    };

    render()
    {
        const { open, addValue } = this.state;
        const { items, selectedValue, setValue, placeholder, handleAdd } = this.props;
        // Dynamically add the first option "-"
        const extendedItems = [{ id: null, name: "-" }, ...items];

        return (
            <Popover open={open} onOpenChange={this.setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between"
                    >
                        {selectedValue !== null
                            ? extendedItems.find((item) => item.id === selectedValue)?.name
                            : "-"}
                        <ChevronsUpDown className="opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    align="end"
                    className="p-0 w-[var(--radix-popper-anchor-width)]"
                >
                    <Command>
                        <CommandInput
                            placeholder={`Search ${placeholder}...`}
                            className="h-9"
                            onInput={(e) =>
                            {
                                if (handleAdd)
                                {
                                    const value = e.currentTarget.value;
                                    this.setState({ addValue: value }); // 更新输入值
                                }
                            }}


                        />
                        {addValue ? (
                            // 当 addValue 不为空时，显示“添加”选项
                            <div className="p-1">
                                <CommandItem
                                    key="add-new-item"
                                    value={addValue}
                                    onSelect={() =>
                                    {
                                        if (handleAdd && addValue)
                                        {
                                            handleAdd(addValue); // 调用 handleAdd 方法
                                            this.setOpen(false); // 关闭弹窗
                                            this.setState({ addValue: null }); // 清空输入值
                                            setValue(-1, addValue); // 设置值为 -1，表示新增项
                                        }
                                    }}
                                >
                                    Add "{addValue}"
                                </CommandItem>
                            </div>


                        ) : (
                            <CommandEmpty>No {placeholder} found.</CommandEmpty>
                        )}
                        <CommandList>
                            <CommandGroup>
                                {extendedItems.map((item) => (
                                    <CommandItem
                                        key={item.id === null ? "null" : item.id} // 确保键唯一
                                        value={item.name}
                                        onSelect={() =>
                                        {
                                            const id = item.id;
                                            let name: string | undefined = undefined;
                                            if (addValue)
                                            {
                                                name = addValue; // 如果有输入值，则使用输入值
                                            }
                                            setValue(id, name); // 设置值
                                            this.setOpen(false); // 关闭弹窗
                                        }}
                                    >
                                        {item.name}
                                        <Check
                                            className={cn(
                                                "ml-auto",
                                                selectedValue === item.id ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        );
    }
}

export { InputComboBox };
