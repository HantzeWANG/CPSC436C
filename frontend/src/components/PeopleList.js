import React, { useState, useEffect } from 'react';
import { fetchPeopleData } from '../services/api';

const PeopleList = () => {
    const [people, setPeople] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getPeopleData = async () => {
            try {
                const data = await fetchPeopleData();
                setPeople(data);
            } catch (err) {
                setError("Failed to fetch data");
            } finally {
                setLoading(false);
            }
        };

        getPeopleData();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h2>People List</h2>
            <ul>
                {people.map((person) => (
                    <li key={person.id}>
                        {person.name}
                        <img src={person.image_url} alt={person.name} />
                    </li>
                    
                ))}
            </ul>
        </div>
    );
};

export default PeopleList;
