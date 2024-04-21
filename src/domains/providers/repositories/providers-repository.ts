import { Provider } from "../entities/provider";


export interface ProvidersRepository {

    insert(provider: Provider): Promise<void>;
    update(provider: Provider): Promise<void>;
}