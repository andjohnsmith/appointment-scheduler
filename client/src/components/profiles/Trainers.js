import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const Trainers = () => {
  const [trainers, setTrainers] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const fetchTrainers = async () => {
      const res = await api.get('/users?role=Trainer');

      if (isMounted) {
        setTrainers(res.data);
      }
    };

    fetchTrainers();

    return () => (isMounted = false);
  });

  return (
    <div className="container">
      <ul>
        {trainers.map((trainer) => (
          <li key={trainer._id}>{trainer.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Trainers;
