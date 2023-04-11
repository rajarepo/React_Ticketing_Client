import { useCallback } from 'react';
import PaginationItem from './PaginationItem';

const Pagination = (props) => {
  const { totalCount, currentPage, onChange } = props;

  const handleChange = useCallback(
    (page) => {
      onChange(page);
    },
    [onChange]
  );

  if (!totalCount) return null;

  return (
    <ul className="flex flex-grow gap-2">
      <PaginationItem label="<" isDisabled={true} onClick={handleChange} />

      {Array(totalCount)
        .fill(0)
        .map((item, idx) => {
          const pageNum = idx + 1;
          const isActive = pageNum === currentPage;
          const isDisabled = totalCount === currentPage;
          return (
            <PaginationItem
              key={`pitem_${idx}`}
              label={pageNum}
              isDisabled={isDisabled}
              isActive={isActive}
              onClick={handleChange}
            />
          );
        })}

      <PaginationItem
        label=">"
        isDisabled={currentPage === totalCount}
        onClick={handleChange}
      />
    </ul>
  );
};

Pagination.defaultProps = {
  totalCount: 0,
  currentPage: 1,
};

export default Pagination;
