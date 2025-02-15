interface ToggleButtonProps {
  isOn: boolean;
  onToggle: () => void;
  label?: string;
}

const ToggleButton = ({ isOn, onToggle, label }: ToggleButtonProps) => {
  return (
    <div className="flex items-center gap-2">
      {label && <span className="text-sm text-gray-600">{label}</span>}
      <button
        onClick={onToggle}
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full
          transition-colors duration-300 ease-in-out focus:outline-none
          ${isOn ? 'bg-sky-500' : 'bg-gray-200'}
        `}
      >
        <span
          className={`
            inline-block h-4 w-4 transform rounded-full bg-white shadow-lg
            transition-transform duration-300 ease-in-out
            ${isOn ? 'translate-x-6' : 'translate-x-1'}
          `}
        />
      </button>
    </div>
  );
};

export default ToggleButton;
