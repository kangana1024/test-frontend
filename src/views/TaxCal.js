import React, { useState } from 'react';
import { Form, Input } from 'antd';
import numeral from 'numeral';
const overFlow = { min: 150001, max: 5000001 };
const taxlimit = [
  { id: 1, min: 150001, max: 300000, tax: 0.05 },
  { id: 2, min: 300001, max: 500000, tax: 0.1 },
  { id: 3, min: 500001, max: 750000, tax: 0.15 },
  { id: 4, min: 750001, max: 1000000, tax: 0.2 },
  { id: 5, min: 1000001, max: 2000000, tax: 0.25 },
  { id: 6, min: 2000001, max: 5000000, tax: 0.3 },
];
const TaxCal = (props) => {
  const [inputTxt, setInputTxt] = useState(0);
  const [taxSumArr, setTaxSumArr] = useState([]);
  const [taxSum, setTaxSum] = useState(0);
  const calTaxByIncome = (input) => {
    setTaxSum(0);
    setInputTxt(input);
    setTaxSumArr([]);
    let inputTax = Number(input);
    console.log(inputTax);
    if (inputTax < overFlow.min) {
      // when net < overFlow.min(150,000)
      taxSumArr.push(0);
    } else {
      // when net > overFlow.min(150,000)
      if (inputTax >= overFlow.max) {
        // when net > overFlow.max(5,000,000)
        taxSumArr.push(calTax(overFlow.max, inputTax, 0.35));
        inputTax = overFlow.max - 1;
      }

      const findLimit = findIndexBetween(inputTax);

      taxSumArr.push(calTax(findLimit.min, inputTax, findLimit.tax));
      inputTax = inputTax - findLimit.max;

      const oSum = taxlimit.filter((oLimit) => {
        return oLimit.id < findLimit.id;
      });

      oSum.forEach((sumItem) => {
        taxSumArr.push(calTax(sumItem.min, sumItem.max, sumItem.tax));
        inputTax = inputTax - sumItem.max;
      });

      setTaxSum((prev) => {
        const res = taxSumArr.reduce(sumTax, 0);
        return res;
      });
    }
  };
  return (
    <div className="animated fadeIn">
      <Form>
        <Form.Item name="netinput" label="Net Income">
          <Input
            type="number"
            onChange={(val) => calTaxByIncome(val.target.value)}
            value={inputTxt}
            placeholder="Input Net Income"
          />
        </Form.Item>
      </Form>
      <strong>Net Income : </strong>
      {numeral(Number(inputTxt).toFixed(2)).format('0,0.00')}
      <br />
      <strong>Tax : </strong>
      {numeral(taxSum.toFixed(2)).format('0,0.00')}
      <br />
    </div>
  );
};
const findIndexBetween = (num) => {
  const limitIndex = taxlimit.find((tax) => {
    return num <= tax.max + 0.99 && num >= tax.min;
  });

  return limitIndex;
};

const calTax = (min, max, tax) => {
  return (max - (min - 1)) * tax;
};

const sumTax = (accumulator, currentValue) => {
  return accumulator + currentValue;
};

export default TaxCal;
