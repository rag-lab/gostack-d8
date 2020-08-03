import { getRepository, Repository, In } from 'typeorm';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO';
import IUpdateProductsQuantityDTO from '@modules/products/dtos/IUpdateProductsQuantityDTO';
import Product from '../entities/Product';

interface IFindProducts {
  id: string;
}

class ProductsRepository implements IProductsRepository {
  private ormRepository: Repository<Product>;

  constructor() {
    this.ormRepository = getRepository(Product);
  }

  public async create({
    name,
    price,
    quantity,
  }: ICreateProductDTO): Promise<Product> {
    // TODO
    const product = this.ormRepository.create({
      name,
      price,
      quantity,
    });

    await this.ormRepository.save(product);
    return product;
  }

  public async findByName(name: string): Promise<Product | undefined> {
    // TODO
    const findProduct = this.ormRepository.findOne({
      where: {
        name,
      },
    });

    return findProduct;
  }

  public async findAllById(products: IFindProducts[]): Promise<Product[]> {
    // TODO
    const productsID = products.map(product => product.id);
    const productsList = await this.ormRepository.find({ id: In(productsID) });

    return productsList;
  }

  public async updateQuantity(
    products: IUpdateProductsQuantityDTO[],
  ): Promise<Product[]> {
    // TODO

    const productsItems = await this.findAllById(products);

    const updatedProducts = productsItems.map(productItem => {
      const productFound = products.find(
        product => product.id === productItem.id,
      );

      const updatedProduct = productItem;

      if (!productFound) {
        return productItem;
      }

      updatedProduct.quantity -= productFound.quantity;

      return updatedProduct;
    });

    await this.ormRepository.save(updatedProducts);

    return updatedProducts;
  }
}

export default ProductsRepository;
