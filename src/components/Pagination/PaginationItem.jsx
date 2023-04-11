import clsx from 'clsx';

const PaginationItem = ({ label, isActive, isDisabled, className }) => {
  return (
    <li className="inline-block">
      <button
        className={clsx(
          'rounded btn leading-5 w-[32px] h-[32px] text-sm',
          {
            'bg-custom-info text-white': isActive,
            'bg-secondary-light text-custom-grey': isDisabled,
            'bg-custom-blue-dark text-custom-info': !isActive && !isDisabled,
          },
          className
        )}
      >
        {label}
      </button>
    </li>
  );
};

PaginationItem.defaultProps = {
  className: '',
  isActive: false,
  isDisabled: false,
};

export default PaginationItem;
