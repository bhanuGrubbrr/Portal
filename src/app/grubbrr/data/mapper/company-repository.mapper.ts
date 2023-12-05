////import { Mapper } from "../../base/mapper"
////import { CompanyEntity } from "../entity/companyEntity";
////import { CompanyModel } from "../../core/models/company.model";

////export class CompanyRepositoryMapper implements Mapper<CompanyEntity, CompanyModel> {
////  mapToList(param: CompanyModel[]): CompanyEntity[] {
////    let companyEntities: CompanyEntity[] = [];

////    param.forEach(cm => {
////      companyEntities.push({
////        id: "0",
////        companyName: cm.companyName,
////        ownerContactNo: cm.ownerContactNo,
////        businessContactNo: cm.businessContactNo,
////        productSeller: cm.productSeller,
////        countryName: cm.countryName
////      })
////    });

////    return companyEntities;
////  }

////  mapFromList(param: CompanyEntity[]): CompanyModel[] {
////    let CompanyModels: CompanyModel[] = [];

////    param.forEach(ce => {
////      CompanyModels.push(
////        {
////          companyName: ce.companyName,
////          ownerContactNo: ce.ownerContactNo,
////          businessContactNo: ce.businessContactNo,
////          productSeller: ce.productSeller,
////          countryName: ce.countryName
////        }
////      )
////    });

////    return CompanyModels;
////  }

////  mapFrom(param: CompanyEntity): CompanyModel {
////    return {
////      companyName: param.companyName,
////      ownerContactNo: param.ownerContactNo,
////      businessContactNo: param.businessContactNo,
////      productSeller: param.productSeller,
////      countryName: param.countryName
////    };
////  }

////  mapTo(param: CompanyModel): CompanyEntity {
////    return {
////      id: "0",
////      companyName: param.companyName,
////      ownerContactNo: param.ownerContactNo,
////      businessContactNo: param.businessContactNo,
////      productSeller: param.productSeller,
////      countryName: param.countryName
////    };
////  }
////}
