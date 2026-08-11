// src/pages/VerifyEsewa.jsx
import { useEffect, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContext } from '@/context/AppContext';

export default function VerifyEsewa() {
  const [searchParams] = useSearchParams();
  const nav = useNavigate();
  const { backendUrl } = useContext(AppContext);

  useEffect(() => {
    const encodedData = searchParams.get('data');
    if (encodedData) {
      verifyPayment(encodedData);
    }
  }, []);

  const verifyPayment = async (encodedData) => {
    try {
      const decoded = JSON.parse(atob(encodedData));
      const { data } = await axios.post(backendUrl + '/api/user/esewa-verify', decoded);

      if (data.success) {
        toast.success('Payment verified successfully');
      } else {
        toast.error('Payment verification failed');
      }
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong');
    } finally {
      nav('/my-appointments');
    }
  };

  return <p className="text-center mt-20">Verifying payment...</p>;
}