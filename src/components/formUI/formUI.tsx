import { useState } from "react";

interface FormFieldProps {
    labelText: string;
    isError: boolean;
    errorText?: string;
    children: React.ReactNode;
}

export const FormFieldWrapper = ({ labelText, isError, errorText, children }: FormFieldProps) => {

    
    return (
        <div>
            <label>{labelText}</label>
            {children}
            {isError && (<span>{errorText}</span>)}
        </div>
    )
};


// custom select

export type GenresToSelect = 'Антиутопия' | 'Биография' | 'Роман' | 'Фантастика' | 'Фэнтези' | 'Детектив' | 'Триллер' | 'Антиутопия' | 'Классика';

interface SelectProps {
    options: Array<GenresToSelect>;
    onChange: (selectedOptions: GenresToSelect[]) => void;
}

interface OptionWithName extends HTMLDivElement {
    dataset: {
        name: GenresToSelect;
    }
}

export const Select = ({ options, onChange }: SelectProps) => {
    const [selectedOptions, setSelectedOptions] = useState<GenresToSelect[]>([]);

    // event handlers
    const deleteOptionFromPanel = (e: React.MouseEvent) => {
        const target = e.currentTarget.closest('.selected-option') as OptionWithName;
        const optionName = target.dataset.name;

        setSelectedOptions(selectedOptions.filter(option => option !== optionName));
        // connect to react-hook-form state
        onChange(selectedOptions);
    };

    const toggleSelectionFromList = (e: React.MouseEvent) => {
        const target = e.currentTarget.closest('.option') as OptionWithName;
        
        const optionName = target.dataset.name;

        if (selectedOptions.includes(optionName)) {
            setSelectedOptions(selectedOptions.filter(option => option !== optionName));
        }
        else {
            setSelectedOptions([...selectedOptions, optionName]);
        }
    };  
    
    // options inside panel of selection
    const renderingSelectedOptions = selectedOptions.map(selectedOption => <OptionInsideSelectPanel
        key={`select-${selectedOption}`} 
        value={selectedOption}
        onClick={deleteOptionFromPanel} 
    />);
    
    const renderingOptionList = options.map(option => (
    <OptionInsideList 
        key={option}
        value={option}
        isSelected={selectedOptions.includes(option) ? true : false}
        onClick={toggleSelectionFromList}
    />));

    return (
        <div>
            <label>Выберите ваши любимые жанры литературы</label>
            <div>
                {renderingSelectedOptions}
            </div>
            <ul>
                {renderingOptionList}
            </ul>
        </div>
    )
};


type ClickHandler = (e: React.MouseEvent) => void
// option components helpers
const OptionInsideSelectPanel = ({ value, onClick }: { value: GenresToSelect, onClick: ClickHandler }) => {
    return (
        <li>
            <div className="selected-option" data-name={value}>
                <button type="button" onClick={onClick}></button>
                <span>{value}</span>
            </div>
        </li>
    )
};

const OptionInsideList = ({ value, isSelected, onClick }: { value: GenresToSelect, isSelected: boolean, onClick: ClickHandler }) => {
    return (
        <li>
            <div className={`option ${isSelected ? 'selected' : ''}`} data-name={value}>
                <button type="button" onClick={onClick}></button>
                <span>{value}</span>
            </div>
        </li>
    )
};