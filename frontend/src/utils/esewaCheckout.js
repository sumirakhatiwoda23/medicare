export const redirectToEsewa = (paymentData) => {
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = 'https://rc-epay.esewa.com.np/api/epay/main/v2/form';

  Object.keys(paymentData).forEach((key) => {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = key;
    input.value = paymentData[key];
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
};