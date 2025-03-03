import React, {
  useEffect,
  useState,
} from 'react';

import {
  DatePicker,
  Select,
} from 'antd';
import { Dayjs } from 'dayjs';
import {
  DATE_TIME_FORMAT_V3,
  FILTER_OPTION,
} from '~/constants/time.constant';

const { RangePicker } = DatePicker;
const { Option } = Select;

export type DateRange = [string, string] | null;

type ModalSelectTimeRangeProps = {
  onSelect: (time: string, range: DateRange) => void;
  allTime?: string
};

const ModalSelectTimeRange = ({ onSelect, allTime }: ModalSelectTimeRangeProps) => {
  const [selectedFilter, setSelectedFilter] = useState<string>(allTime ? allTime : FILTER_OPTION?.[0]?.value)

  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
  const [dateRange, setDateRange] = useState<DateRange>(null);

  const isCustom = selectedFilter === 'custom';

  const handleFilterChange = (value: string) => {
    setSelectedFilter(value);
    onSelect(value, null);

    if (value === 'custom') {
      setDropdownVisible(true);
    } else {
      setDateRange(null);
      setDropdownVisible(false);
    }
  };

  const handleDateChange = (dates: [Dayjs | null, Dayjs | null]) => {
    if (dates[0] && dates[1]) {
      const formattedRange: [string, string] = [
        dates[0].format(DATE_TIME_FORMAT_V3),
        dates[1].format(DATE_TIME_FORMAT_V3),
      ];
      setDateRange(formattedRange);
      onSelect('custom', formattedRange);
    }
  };

  useEffect(() => {
    if (isCustom && dateRange) {
      setDropdownVisible(false);
    }
  }, [dateRange, selectedFilter]);

  return (
    <Select
      onClick={() => isCustom && setDropdownVisible(true)}
      value={
        isCustom && dateRange
          ? `${dateRange[0]} - ${dateRange[1]}`
          : selectedFilter
      }
      style={{ width: allTime ? 240 : isCustom ? 240 : 160 }}
      onChange={handleFilterChange}
      open={dropdownVisible || (isCustom && !dateRange)}
      onDropdownVisibleChange={(visible) => {
        if (!isCustom) {
          setDropdownVisible(visible);
        }
      }}
      dropdownRender={(menu) => (
        <>
          {menu}
          {isCustom && (
            <div style={{ padding: 8 }} onMouseDown={(e) => e.preventDefault()}>
              <RangePicker
                onChange={(dates) => handleDateChange(dates as [Dayjs | null, Dayjs | null])}
                format={DATE_TIME_FORMAT_V3}
                style={{ width: '100%' }}
              />
            </div>
          )}
        </>
      )}
    >
      {allTime && <Option key={''} value={''}>{allTime}</Option>}
      {FILTER_OPTION.map((option) => (
        <Option key={option.value} value={option.value}>
          {option.label}
        </Option>
      ))}
    </Select>
  );
};

export default ModalSelectTimeRange;
