import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusIcon, TrashIcon } from "lucide-react";

interface FilterRule {
  field: string;
  operator: 'contains' | 'equals' | 'greater' | 'less' | 'regex';
  value: string;
}

export default function FilterConfig({ 
  rules,
  onChange
}: {
  rules: FilterRule[];
  onChange: (rules: FilterRule[]) => void;
}) {
  const addRule = () => {
    onChange([...rules, { field: '', operator: 'contains', value: '' }]);
  };

  const removeRule = (index: number) => {
    const newRules = rules.filter((_, i) => i !== index);
    onChange(newRules);
  };

  const updateRule = (index: number, updates: Partial<FilterRule>) => {
    const newRules = rules.map((rule, i) => 
      i === index ? { ...rule, ...updates } : rule
    );
    onChange(newRules);
  };

  return (
    <div className="space-y-4">
      {rules.map((rule, index) => (
        <div key={index} className="flex items-center gap-2">
          <Input
            placeholder="Field name"
            value={rule.field}
            onChange={(e) => updateRule(index, { field: e.target.value })}
          />
          <Select
            value={rule.operator}
            onValueChange={(value: FilterRule['operator']) => 
              updateRule(index, { operator: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="contains">Contains</SelectItem>
              <SelectItem value="equals">Equals</SelectItem>
              <SelectItem value="greater">Greater than</SelectItem>
              <SelectItem value="less">Less than</SelectItem>
              <SelectItem value="regex">Regex</SelectItem>
            </SelectContent>
          </Select>
          <Input
            placeholder="Value"
            value={rule.value}
            onChange={(e) => updateRule(index, { value: e.target.value })}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => removeRule(index)}
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button
        variant="outline"
        size="sm"
        className="w-full"
        onClick={addRule}
      >
        <PlusIcon className="h-4 w-4 mr-2" />
        Add Filter Rule
      </Button>
    </div>
  );
} 