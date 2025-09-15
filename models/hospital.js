function filterHospitals(query, hospitals) {
    if (query.Name) {
        hospitals = hospitals.filter(({ name }) => name.toLowerCase().includes(query.Name.toLowerCase()))
    }
    if (query.SpecialtyId) {
        hospitals = hospitals.filter(({ specialties }) =>
            specialties.some(({ name }) =>
                name.toLowerCase().includes(query.SpecialtyId.toLowerCase())
            )
        )
    }
    if (query.Filter) {
        switch (query.Filter) {
            case 'name-asc':
                hospitals.sort((hospital_a, hospital_b) =>
                    hospital_a.name.localeCompare(hospital_b.name)
                );
                break;
            case 'name-desc':
                hospitals.sort((hospital_a, hospital_b) =>
                    hospital_b.name.localeCompare(hospital_a.name)
                );
                break;
            default:
                break;
        }
    }

    return hospitals;
}

module.exports = { filterHospitals }
