import { useCallback, useState } from 'react';
import useHttpRequest from './useHttpRequest';

const useLoadCategories = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [firstCategory, setFirstCategory] = useState('');
  const [firstSubcategory, setFirstSubcategory] = useState('');

  const { sendRequest } = useHttpRequest();

  const getLoadCategories = useCallback(() => {
    const getCategoriesData = (data) => {
      const cat = [];
      const subcat = [];
      data.forEach((category) => {
        if (category.parent_id == null) {
          cat.push(category);
        } else {
          subcat.push(category);
        }
      });
      if (cat.length > 0) {
        setFirstCategory(cat[0].id);
      }
      if (subcat.length > 0) {
        setFirstSubcategory(subcat[0].id);
      }
      setCategories(cat);
      setSubcategories(subcat);
    };

    sendRequest(
      { url: 'api/categories' },
      getCategoriesData,
    );
  }, [sendRequest]);

  return {
    getLoadCategories,
    categories,
    subcategories,
    firstCategory,
    firstSubcategory,
  };
};

export default useLoadCategories;
