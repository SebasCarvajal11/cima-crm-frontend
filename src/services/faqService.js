import api from './api';
import logger from '../utils/logger';

export const faqService = {
  async getAllFaqs() {
    try {
      logger.debug('Fetching all FAQs');
      const response = await api.get('/faqs/all');
      logger.debug('FAQs fetched successfully:', response.data);
      return response.data.faqs;
    } catch (error) {
      logger.error('Error fetching FAQs:', error);
      throw error;
    }
  },

  async createFaq(faqData) {
    try {
      logger.debug('Creating new FAQ:', faqData);
      const response = await api.post('/faqs', faqData);
      logger.debug('FAQ created successfully:', response.data);
      return response.data.faq;
    } catch (error) {
      logger.error('Error creating FAQ:', error);
      throw error;
    }
  },

  async updateFaq(id, faqData) {
    try {
      logger.debug(`Updating FAQ with ID ${id}:`, faqData);

      if (!id) {
        logger.error('Missing FAQ ID for update operation');
        throw new Error('FAQ ID is required for update');
      }

      const formattedId = id.toString().trim();

      const response = await api.put(`/faqs/${formattedId}`, faqData);

      logger.debug('FAQ updated successfully:', response.data);

      return response.data.faq;
    } catch (error) {
      logger.error(`Error updating FAQ with ID ${id}:`, error);
      throw error;
    }
  },

  async deleteFaq(id) {
    try {
      logger.debug(`Deleting FAQ with ID ${id}`);
      await api.delete(`/faqs/${id}`);
      logger.debug('FAQ deleted successfully');
      return true;
    } catch (error) {
      logger.error(`Error deleting FAQ with ID ${id}:`, error);
      throw error;
    }
  },

  async searchFaqs(searchTerm) {
    try {
      logger.debug(`Searching FAQs with term: ${searchTerm}`);
      const response = await api.get(`/faqs/search/${searchTerm}`);
      logger.debug('Search results:', response.data);
      return response.data.faqs;
    } catch (error) {
      logger.error(`Error searching FAQs with term ${searchTerm}:`, error);
      throw error;
    }
  },

  async getFaqById(id) {
    try {
      logger.debug(`Fetching FAQ with ID ${id}`);
      const response = await api.get(`/faqs/${id}`);
      logger.debug('FAQ fetched successfully:', response.data);
      return response.data.faq;
    } catch (error) {
      logger.error(`Error fetching FAQ with ID ${id}:`, error);
      throw error;
    }
  }
};

export default faqService;
