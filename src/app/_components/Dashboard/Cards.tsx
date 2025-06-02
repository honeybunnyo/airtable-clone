import React from 'react'
import { api } from '~/trpc/react';
import Card from './Card';

const Cards = () => {
  const { data: bases, isLoading } = api.base.getAllBases.useQuery();

  if (isLoading) return <div>Loading cards ...</div>;

  return (
    <div>
      <div className='mt-10 grid gap-4 grid-cols-[repeat(auto-fit,_minmax(250px,_1fr))]'>
        {bases?.map((base) => (
          <Card key={base.id} base={base}/>
        ))}
      </div>
    </div>
  );
}

export default Cards