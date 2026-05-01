import axios from 'axios';
import { store } from '../redux/store';
import logger from '../utils/logger';

const API_URL = `${import.meta.env.VITE_API_URL}/faqs`;

// Helper function to get the authentication token from Redux store
const getAuthToken = () => {
  const state = store.getState();
  return state.auth?.token || localStorage.getItem('accessToken');
};

// Helper to create headers with authentication token
const getHeaders = () => ({
  headers: {
    'Content-Type': 'application/json',
    'accesstoken': getAuthToken()
  }
});

export const faqService = {
  // Get all FAQs
  async getAllFaqs() {
    try {
      logger.debug('Fetching all FAQs');
      const response = await axios.get(`${API_URL}/all`);
      logger.debug('FAQs fetched successfully:', response.data);
      return response.data.faqs;
    } catch (error) {
      logger.error('Error fetching FAQs:', error);
      throw error;
    }
  },

  // Create a new FAQ
  async createFaq(faqData) {
    try {
      logger.debug('Creating new FAQ:', faqData);
      const response = await axios.post(API_URL, faqData, getHeaders());
      logger.debug('FAQ created successfully:', response.data);
      return response.data.faq;
    } catch (error) {
      logger.error('Error creating FAQ:', error);
      throw error;
    }
  },

  // Update an existing FAQ
  async updateFaq(id, faqData) {
    try {
      logger.debug(`Updating FAQ with ID ${id}:`, faqData);
      
      // Check if id is undefined, null, or empty string
      if (!id) {
        logger.error('Missing FAQ ID for update operation');
        throw new Error('FAQ ID is required for update');
      }
      
      // Ensure we have the correct headers
      const headers = getHeaders();
      
      // Make sure the ID is properly formatted for the API request
      const formattedId = id.toString().trim();
      
      const response = await axios.put(`${API_URL}/${formattedId}`, faqData, headers);
      
      logger.debug('FAQ updated successfully:', response.data);
      
      return response.data.faq;
    } catch (error) {
      logger.error(`Error updating FAQ with ID ${id}:`, error);
      throw error;
    }
  },

  // Delete a FAQ
  async deleteFaq(id) {
    try {
      logger.debug(`Deleting FAQ with ID ${id}`);
      await axios.delete(`${API_URL}/${id}`, getHeaders());
      logger.debug('FAQ deleted successfully');
      return true;
    } catch (error) {
      logger.error(`Error deleting FAQ with ID ${id}:`, error);
      throw error;
    }
  },

  // Search FAQs by term
  async searchFaqs(searchTerm) {
    try {
      logger.debug(`Searching FAQs with term: ${searchTerm}`);
      const response = await axios.get(`${API_URL}/search/${searchTerm}`);
      logger.debug('Search results:', response.data);
      return response.data.faqs;
    } catch (error) {
      logger.error(`Error searching FAQs with term ${searchTerm}:`, error);
      throw error;
    }
  },

  // Get FAQ by ID
  async getFaqById(id) {
    try {
      logger.debug(`Fetching FAQ with ID ${id}`);
      const response = await axios.get(`${API_URL}/${id}`);
      logger.debug('FAQ fetched successfully:', response.data);
      return response.data.faq;
    } catch (error) {
      logger.error(`Error fetching FAQ with ID ${id}:`, error);
      throw error;
    }
  }
};

export default faqService;