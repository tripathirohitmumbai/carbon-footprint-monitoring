import * as React from 'react';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Cancel';

function Co2TableRows({ rowsData, deleteTableRows, handleCo2Change }) {
  return (
    rowsData &&
    rowsData.map((data, index) => {
      const { year, value } = data;
      
      return (
        <tr key={index}>
          <td>
            <TextField
              type='text'
              value={year}
              onChange={(evnt) => handleCo2Change(index, evnt)}
              name='year'
              className='form-control'
              id='outlined-basic'
              label='Year'
              variant='standard'
              color='secondary'
            />
          </td>
          <td>
            <TextField
              type='text'
              value={value}
              onChange={(evnt) => handleCo2Change(index, evnt)}
              name='value'
              className='form-control'
              id='outlined-basic'
              label='CO2 Value'
              variant='standard'
              color='secondary'
            />
          </td>
          <td>
            <IconButton
              onClick={() => deleteTableRows(index)}
              data-testid={'edit-battery-button'}
            >
              <DeleteIcon />
            </IconButton>
          </td>
        </tr>
      );
    })
  );
}

export default Co2TableRows;
