import React from 'react';

const dataOptions = [
                { label: "Intake Rate", value: "dintakedt" },
                { label: "Water Flow Rate", value: "dQH2Odt" },
                { label: "Phosphorus Flow Rate", value: "dQPidt" },
                { label: "Ammonia Flow Rate", value: "dQAmdt" },
                { label: "Bacterial Flow Rate", value: "dQBadt" },
                { label: "Fatty Acid Flow Rate", value: "dQBfdt" },
                { label: "Nitrogen Flow Rate", value: "dQFndt" },
                { label: "Organic Phosphorus Flow Rate", value: "dQPoFldt" },
                { label: "Soluble Phosphorus Flow Rate", value: "dQSpFldt" },
                { label: "Triglyceride Flow Rate", value: "dQTgdt" },
                { label: "Fumarate Flow Rate", value: "dQFudt" },
                { label: "Formate Flow Rate", value: "dQFddt" },
                { label: "Silage Flow Rate", value: "dQSidt" },
                { label: "Starch Flow Rate", value: "dQSfdt" },
                { label: "Lactate Flow Rate", value: "dQLadt" },
                { label: "Soluble Sugar Flow Rate", value: "dQSadt" },
                { label: "Fermentable Nitrogen Flow Rate", value: "dQSfndt" },
                { label: "Lactate Production Rate", value: "dQLactatedt" },
                { label: "Acetate Production Rate", value: "dQAcdt" },
                { label: "Acetate Flow Rate", value: "dQAcetatedt" },
                { label: "Butyrate Production Rate", value: "dQBudt" },
                { label: "Butyrate Flow Rate", value: "dQButyratedt" },
                { label: "Propionate Production Rate", value: "dQPrdt" },
                { label: "Propionate Flow Rate", value: "dQPropionatedt" },
                { label: "Bromide Production Rate", value: "dQBrdt" },
                { label: "NOP Production Rate", value: "dQNOPdt" },
                { label: "Nitrate Flow Rate", value: "dQNO3dt" },
                { label: "Nitrite Flow Rate", value: "dQNO2dt" },
                { label: "Nitrous Oxide Flow Rate", value: "dQN2Odt" },
                { label: "NADH Flow Rate", value: "dQNADHdt" },
                { label: "Hydrogen Flow Rate", value: "dQH2dt" },
                { label: "Methane Production Rate", value: "dQMedt" },
                { label: "Methane Flow Rate", value: "dQCH4dt" },
                { label: "Carbon Dioxide Flow Rate", value: "dQCO2dt" },
                { label: "Bicarbonate Flow Rate", value: "dQBicarbdt" },
                { label: "Hydrogen Ion Flow Rate", value: "dQHplusdt" },
                { label: "Maximum Hydrogen Ion Flow Rate", value: "dQmaxHplusdt" },
                { label: "Insoluble Fiber Flow Rate", value: "dQInsolFSGdt" },
                { label: "Organic Matter Flow Rate to Hindgut", value: "dQOMHinddt" },
                { label: "Fecal Organic Matter Flow Rate", value: "dQOMFecaldt" },
                { label: "Hindgut Methane Production Rate", value: "dQCH4_hinddt" },
                { label: "Fecal Water Flow Rate", value: "dQfecalH2Odt" },
                { label: "Fecal Nitrogen Flow Rate", value: "dQfecalNdt" },
                { label: "Fecal Carbon Flow Rate", value: "dQfecalCdt" },
                { label: "Digestible Protein Flow Rate", value: "dQDpdt" },
                { label: "Indigestible Protein Flow Rate", value: "dQIpdt" },
                { label: "Ruminal Microbial Protein Flow Rate", value: "dQRMpdt" },
                { label: "Gastrointestinal Protein Flow Rate", value: "dQGpdt" },
                { label: "Nitrogen Production Rate", value: "dQNpdt" },
                { label: "Bacterial Amino Acid Flow Rate", value: "dQLBadt" },
                { label: "Fatty Acid Amino Acid Flow Rate", value: "dQLBfdt" },
                { label: "Lipid Flow Rate", value: "dQLpdt" },
                { label: "Monounsaturated Fatty Acid Flow Rate", value: "dQLMpdt" },
                { label: "Triglyceride Flow Rate", value: "dQTpdt" },
                { label: "Ethanol Production Rate", value: "dQEpdt" },
                { label: "Fermentation Product Flow Rate", value: "dQFpdt" },
                { label: "Urea Production Rate", value: "dQUpdt" },
                { label: "Organic Phosphate Flow Rate", value: "dQPodt" },
                { label: "Soluble Phosphate Flow Rate", value: "dQSpdt" },
                { label: "Soluble Sugar Flow Rate", value: "dQPsdt" },
                { label: "Water-Soluble Sugar Flow Rate", value: "dQWsdt" },
                { label: "Unsaturated Fatty Acid Flow Rate", value: "dQFaUdt" },
                { label: "Saturated Fatty Acid Flow Rate", value: "dQFaSdt" }
            ];


const DataSelector = ({ onSelectionChange }) => {
    const handleChange = (e) => {
        const value = e.target.value;
        onSelectionChange(value);
    };

    return (
        <div>
            <label htmlFor="data-select">Select Data to Plot:</label>
            <select id="data-select" onChange={handleChange}>
                {dataOptions.map((option, index) => (
                    <option key={index} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default DataSelector;
