import { LightningElement, track } from 'lwc';

export default class MyFinancialReport extends LightningElement {
    @track startDate = '';
    @track endDate = '';
    @track frequency = '';
    @track inputFields = [];
    @track chargedDaysFields = [];
    @track nonBillableDaysFields = [];
    @track total = 0;
    @track errorMessage = '';
    @track showTotal = false;

    frequencyOptions = [
        { label: 'Monthly', value: 'monthly' },
        { label: 'Quarterly', value: 'quarterly' },
        { label: 'Semi-Annual', value: 'semi-annual' },
        { label: 'Annual', value: 'annual' }
    ];

    handleStartDateChange(event) {
        this.startDate = event.target.value;
        this.refreshFields();
    }

    handleEndDateChange(event) {
        this.endDate = event.target.value;
        this.refreshFields();
    }

    handleFrequencyChange(event) {
        this.frequency = event.target.value;
        this.refreshFields();
    }

    handleInputChange(event) {
        const id = event.target.dataset.id;
        const value = parseFloat(event.target.value) || 0;
        this.inputFields = this.inputFields.map(field =>
            field.id === id ? { ...field, value } : field
        );
        this.chargedDaysFields = this.chargedDaysFields.map(field =>
            field.id === id ? { ...field, value } : field
        );
        this.nonBillableDaysFields = this.nonBillableDaysFields.map(field =>
            field.id === id ? { ...field, value } : field
        );
    }

    handleCalculateTotal() {
        this.calculateTotal();
        this.showTotal = true;
    }

    refreshFields() {
        this.validateDates();
        if (!this.errorMessage) {
            this.updateInputFields();
            this.updateChargedDaysFields();
            this.updateNonBillableDaysFields();
        }
    }

    validateDates() {
        const start = new Date(this.startDate);
        const end = new Date(this.endDate);
    
        if (!start || !end) {
            this.errorMessage = 'Start and End dates are required.';
            this.inputFields = [];
            this.chargedDaysFields = [];
            this.nonBillableDaysFields = [];
            this.total = 0;
            this.showTotal = false;
            return;
        }
    
        if (end < start) {
            this.errorMessage = 'End date must be after start date.';
            this.inputFields = [];
            this.chargedDaysFields = [];
            this.nonBillableDaysFields = [];
            this.total = 0;
            this.showTotal = false;
            return;
        }
    
        // Calculate the difference in months between start and end date
        const monthsDifference = (end.getFullYear() - start.getFullYear()) * 12 + end.getMonth() - start.getMonth();
    
        if (monthsDifference < 1) {
            this.errorMessage = 'The date range must span at least one month.';
            this.inputFields = [];
            this.chargedDaysFields = [];
            this.nonBillableDaysFields = [];
            this.total = 0;
            this.showTotal = false;
            return;
        }
    
        // If all validations pass
        this.errorMessage = '';
        if (this.startDate && this.endDate && this.frequency) {
            this.updateInputFields();
            this.updateChargedDaysFields();
            this.updateNonBillableDaysFields();
        }
    }
    

    updateInputFields() {
        if (this.startDate && this.endDate && this.frequency) {
            this.inputFields = this.calculateInputFields();
            this.showTotal = false;
        }
    }

    updateChargedDaysFields() {
        if (this.startDate && this.endDate && this.frequency) {
            this.chargedDaysFields = this.calculateChargedDaysFields();
        }
    }

    updateNonBillableDaysFields() {
        if (this.startDate && this.endDate && this.frequency) {
            this.nonBillableDaysFields = this.calculateNonBillableDaysFields();
        }
    }

    calculateInputFields() {
        let fields = [];
        let start = new Date(this.startDate);
        let end = new Date(this.endDate);
        let startYear = start.getFullYear();
        let endYear = end.getFullYear();
        let startMonth = start.getMonth();
        let endMonth = end.getMonth();

        if (this.frequency === 'annual') {
            if (startYear === endYear) {
                fields.push({ id: `annual-${startYear}`, label: `Jan - Dec ${startYear}`, value: 0 });
            } else {
                for (let year = startYear; year <= endYear; year++) {
                    fields.push({ id: `annual-${year}`, label: `Jan - Dec ${year}`, value: 0 });
                }
            }
        } else if (this.frequency === 'monthly') {
            for (let year = startYear; year <= endYear; year++) {
                let monthStart = (year === startYear) ? startMonth : 0;
                let monthEnd = (year === endYear) ? endMonth : 11;
                for (let month = monthStart; month <= monthEnd; month++) {
                    fields.push({ id: `month-${year}-${month}`, label: `${this.getMonthName(month)} ${year}`, value: 0 });
                }
            }
        } else if (this.frequency === 'semi-annual') {
            const addSemiAnnualPeriod = (start, end, year) => {
                if (start <= 5) {
                    fields.push({ id: `first-half-${year}`, label: `Jan - Jun ${year}`, value: 0 });
                }
                if (end >= 6) {
                    fields.push({ id: `second-half-${year}`, label: `Jul - Dec ${year}`, value: 0 });
                }
            };

            for (let year = startYear; year <= endYear; year++) {
                let yearStart = (year === startYear) ? startMonth : 0;
                let yearEnd = (year === endYear) ? endMonth : 11;

                if (year === startYear && year === endYear) {
                    addSemiAnnualPeriod(yearStart, yearEnd, year);
                } else if (year === startYear) {
                    addSemiAnnualPeriod(yearStart, 11, year);
                } else if (year === endYear) {
                    addSemiAnnualPeriod(0, yearEnd, year);
                } else {
                    addSemiAnnualPeriod(0, 11, year);
                }
            }
        } else if (this.frequency === 'quarterly') {
            const quarters = [
                { start: 0, end: 2, label: 'Jan - Mar' },
                { start: 3, end: 5, label: 'Apr - Jun' },
                { start: 6, end: 8, label: 'Jul - Sep' },
                { start: 9, end: 11, label: 'Oct - Dec' }
            ];

            for (let year = startYear; year <= endYear; year++) {
                for (let q of quarters) {
                    let quarterStartDate = new Date(year, q.start, 1);
                    let quarterEndDate = new Date(year, q.end + 1, 0);

                    if (this.isDateRangeOverlaps(start, end, quarterStartDate, quarterEndDate)) {
                        fields.push({
                            id: `quarterly-${year}-${q.start}`,
                            label: `${q.label} ${year}`, // Updated label format
                            value: 0
                        });
                    }
                }
            }
        }
        return fields;
    }

    calculateChargedDaysFields() {
        let fields = [];
        if (this.startDate && this.endDate && this.frequency) {
            if (this.frequency === 'monthly') {
                let start = new Date(this.startDate);
                let end = new Date(this.endDate);
                let startYear = start.getFullYear();
                let endYear = end.getFullYear();
                let startMonth = start.getMonth();
                let endMonth = end.getMonth();

                for (let year = startYear; year <= endYear; year++) {
                    let monthStart = (year === startYear) ? startMonth : 0;
                    let monthEnd = (year === endYear) ? endMonth : 11;
                    for (let month = monthStart; month <= monthEnd; month++) {
                        fields.push({
                            id: `charged-days-${year}-${month}`,
                            label: `Charged Days (${this.getMonthName(month)} ${year})`,
                            value: 0
                        });
                    }
                }
            } else if (this.frequency === 'quarterly') {
                const quarters = [
                    { start: 0, end: 2, label: 'Jan - Mar' },
                    { start: 3, end: 5, label: 'Apr - Jun' },
                    { start: 6, end: 8, label: 'Jul - Sep' },
                    { start: 9, end: 11, label: 'Oct - Dec' }
                ];

                let start = new Date(this.startDate);
                let end = new Date(this.endDate);

                for (let year = start.getFullYear(); year <= end.getFullYear(); year++) {
                    for (let q of quarters) {
                        let quarterStartDate = new Date(year, q.start, 1);
                        let quarterEndDate = new Date(year, q.end + 1, 0);

                        if (this.isDateRangeOverlaps(start, end, quarterStartDate, quarterEndDate)) {
                            fields.push({
                                id: `charged-days-${year}-${q.start}`,
                                label: `Charged Days (${q.label} ${year})`, // Updated label format
                                value: 0
                            });
                        }
                    }
                }
            } else if (this.frequency === 'semi-annual') {
                let start = new Date(this.startDate);
                let end = new Date(this.endDate);
                const semiAnnualPeriods = [
                    { start: 0, end: 5, label: 'Jan - Jun' },
                    { start: 6, end: 11, label: 'Jul - Dec' }
                ];

                for (let year = start.getFullYear(); year <= end.getFullYear(); year++) {
                    for (let period of semiAnnualPeriods) {
                        let periodStartDate = new Date(year, period.start, 1);
                        let periodEndDate = new Date(year, period.end + 1, 0);

                        if (this.isDateRangeOverlaps(start, end, periodStartDate, periodEndDate)) {
                            fields.push({
                                id: `charged-days-${year}-${period.start}`,
                                label: `Charged Days (${period.label} ${year})`, // Updated label format
                                value: 0
                            });
                        }
                    }
                }
            } else if (this.frequency === 'annual') {
                let start = new Date(this.startDate);
                let end = new Date(this.endDate);
                for (let year = start.getFullYear(); year <= end.getFullYear(); year++) {
                    fields.push({
                        id: `charged-days-${year}`,
                        label: `Charged Days (${year})`,
                        value: 0
                    });
                }
            }
        }
        return fields;
    }

    calculateNonBillableDaysFields() {
        let fields = [];
        if (this.startDate && this.endDate && this.frequency) {
            if (this.frequency === 'monthly') {
                let start = new Date(this.startDate);
                let end = new Date(this.endDate);
                let startYear = start.getFullYear();
                let endYear = end.getFullYear();
                let startMonth = start.getMonth();
                let endMonth = end.getMonth();

                for (let year = startYear; year <= endYear; year++) {
                    let monthStart = (year === startYear) ? startMonth : 0;
                    let monthEnd = (year === endYear) ? endMonth : 11;
                    for (let month = monthStart; month <= monthEnd; month++) {
                        fields.push({
                            id: `non-billable-days-${year}-${month}`,
                            label: `Non-Billable Days (${this.getMonthName(month)} ${year})`,
                            value: 0
                        });
                    }
                }
            } else if (this.frequency === 'quarterly') {
                const quarters = [
                    { start: 0, end: 2, label: 'Jan - Mar' },
                    { start: 3, end: 5, label: 'Apr - Jun' },
                    { start: 6, end: 8, label: 'Jul - Sep' },
                    { start: 9, end: 11, label: 'Oct - Dec' }
                ];

                let start = new Date(this.startDate);
                let end = new Date(this.endDate);

                for (let year = start.getFullYear(); year <= end.getFullYear(); year++) {
                    for (let q of quarters) {
                        let quarterStartDate = new Date(year, q.start, 1);
                        let quarterEndDate = new Date(year, q.end + 1, 0);

                        if (this.isDateRangeOverlaps(start, end, quarterStartDate, quarterEndDate)) {
                            fields.push({
                                id: `non-billable-days-${year}-${q.start}`,
                                label: `Non-Billable Days (${q.label} ${year})`, // Updated label format
                                value: 0
                            });
                        }
                    }
                }
            } else if (this.frequency === 'semi-annual') {
                let start = new Date(this.startDate);
                let end = new Date(this.endDate);
                const semiAnnualPeriods = [
                    { start: 0, end: 5, label: 'Jan - Jun' },
                    { start: 6, end: 11, label: 'Jul - Dec' }
                ];

                for (let year = start.getFullYear(); year <= end.getFullYear(); year++) {
                    for (let period of semiAnnualPeriods) {
                        let periodStartDate = new Date(year, period.start, 1);
                        let periodEndDate = new Date(year, period.end + 1, 0);

                        if (this.isDateRangeOverlaps(start, end, periodStartDate, periodEndDate)) {
                            fields.push({
                                id: `non-billable-days-${year}-${period.start}`,
                                label: `Non-Billable Days (${period.label} ${year})`, // Updated label format
                                value: 0
                            });
                        }
                    }
                }
            } else if (this.frequency === 'annual') {
                let start = new Date(this.startDate);
                let end = new Date(this.endDate);
                for (let year = start.getFullYear(); year <= end.getFullYear(); year++) {
                    fields.push({
                        id: `non-billable-days-${year}`,
                        label: `Non-Billable Days (${year})`,
                        value: 0
                    });
                }
            }
        }
        return fields;
    }

    getMonthName(month) {
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return months[month];
    }

    isDateRangeOverlaps(start1, end1, start2, end2) {
        return start1 <= end2 && end1 >= start2;
    }

    // calculateTotal() {
    //     const allFields = [...this.inputFields, ...this.chargedDaysFields, ...this.nonBillableDaysFields];
    //     this.total = allFields.reduce((sum, field) => sum + field.value, 0);
    // }

    calculateTotal() {
        // Sum the values of only the revenue input fields
        this.total = this.inputFields.reduce((sum, field) => sum + (Number(field.value) || 0), 0);
    }
    
}
