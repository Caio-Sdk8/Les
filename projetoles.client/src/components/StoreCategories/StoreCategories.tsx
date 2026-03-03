import {
  CategoriesBar,
  CategoryButton,
  CategoryIcon,
  CategoryName,
} from "./style";

export type StoreCategory = {
  id: string;
  name: string;
  icon: string;
};

type StoreCategoriesProps = {
  categories: StoreCategory[];
  activeCategory: string;
  onSelectCategory: (categoryName: string) => void;
};

export const StoreCategories = ({
  categories,
  activeCategory,
  onSelectCategory,
}: StoreCategoriesProps) => {
  return (
    <CategoriesBar>
      {categories.map((category) => (
        <CategoryButton
          key={category.id}
          type="button"
          $active={category.name === activeCategory}
          onClick={() => onSelectCategory(category.name)}
        >
          <CategoryIcon>{category.icon}</CategoryIcon>
          <CategoryName>{category.name}</CategoryName>
        </CategoryButton>
      ))}
    </CategoriesBar>
  );
};
