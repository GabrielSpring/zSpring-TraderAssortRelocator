import { DependencyContainer } from "tsyringe";

import { IPostDBLoadMod } from "@spt/models/external/IPostDBLoadMod";
import { ILogger } from "@spt/models/spt/utils/ILogger";
import { DatabaseServer } from "@spt/servers/DatabaseServer";
import { IDatabaseTables } from "@spt/models/spt/server/IDatabaseTables";
import { TraderHelper } from "@spt/helpers/TraderHelper";
import { HashUtil } from "@spt/utils/HashUtil";

import { FluentAssortConstructor as FluentAssortCreator } from "../src/fluentTraderAssortCreator";

class Mod implements IPostDBLoadMod
{
    private fluentAssortCreator: FluentAssortCreator;
    private logger: ILogger;
    private VanillaItems = require("../db/items.json");
    private Config = require("../config/config.json");
    private VanillaTraders = [  "5a7c2eca46aef81a7ca2145d", // Mechanic
                                "5ac3b934156ae10c4430e83c", // Ragman
                                "5c0647fdd443bc2504c2d371", // Jaeger
                                "54cb50c76803fa8b248b4571", // Prapor
                                "54cb57776803fa99248b456e", // Therapist
                                "579dc571d53a0658a154fbec", // Fence
                                "638f541a29ffd1183d187f57", // caretaker (Lightkeeper)
                                "656f0f98d80a697f855d34b1", // БТР (BTR?)
                                "5935c25fb3acc3127c3d8cd9", // Peacekeeper
                                "6617beeaa9cfa777ca915b7c", // Arena (Ref)
                                "58330581ace78e27b8b10cee", // Skier
                                "ragfair"                   // Unknown (Flea?)
    ]
    private TraderToId = {
        "Mechanic"    : "5a7c2eca46aef81a7ca2145d",
        "Ragman"      : "5ac3b934156ae10c4430e83c",
        "Jaeger"      : "5c0647fdd443bc2504c2d371",
        "Prapor"      : "54cb50c76803fa8b248b4571",
        "Therapist"   : "54cb57776803fa99248b456e",
        "Fence"       : "579dc571d53a0658a154fbec",
        "Lightkeeper" : "638f541a29ffd1183d187f57",
        "BTR"         : "656f0f98d80a697f855d34b1",
        "Peacekeeper" : "5935c25fb3acc3127c3d8cd9",
        "Ref"         : "6617beeaa9cfa777ca915b7c",
        "Skier"       : "58330581ace78e27b8b10cee",
        "Flea"        : "ragfair"
    }
    private ParentToTrader = {
        "57864bb7245977548b3b66c2" : this.TraderToId['Jaeger'], //Tools
        "57864c8c245977548867e7f1" : this.TraderToId['Jaeger'], //Medical Supplies
        "57864e4c24597754843f8723" : this.TraderToId['Jaeger'], //Flammable materials
        "57864a3d24597754843f8721" : this.TraderToId['Jaeger'], //Jewelry
        "57864c322459775490116fbf" : this.TraderToId['Jaeger'], //HouseholdGoods
        "57864a66245977548f04a81f" : this.TraderToId['Jaeger'], //Electronics
        "57864ada245977548638de91" : this.TraderToId['Jaeger'], //BuildingMaterial
        "57864ee62459775490116fc1" : this.TraderToId['Jaeger'], //Battery
        "590c745b86f7743cc433c5f2" : this.TraderToId['Jaeger'], //Other
        "57bef4c42459772e8d35a53b" : this.TraderToId['Ragman'], //GearComponents
        "5448e54d4bdc2dcc718b4568" : this.TraderToId['Ragman'], //Armor
        "5448bf274bdc2dfc2f8b456a" : this.TraderToId['Peacekeeper'], //Secured Containers
        "5671435f4bdc2d96058b4569" : this.TraderToId['Therapist'], //Containers & Case
        "5795f317245977243854e041" : this.TraderToId['Therapist'], //SimpleContainer
        "5448e5284bdc2dcb718b4567" : this.TraderToId['Ragman'], //Vest
        "5448e53e4bdc2d60728b4567" : this.TraderToId['Ragman'], //Backpack
        "5645bcb74bdc2ded0b8b4578" : this.TraderToId['Ragman'], //Headset
        "5448e5724bdc2ddf718b4568" : this.TraderToId['Ragman'], //Visor
        "5a341c4086f77401f2541505" : this.TraderToId['Ragman'], //Headwear
        "5a341c4686f77469e155819e" : this.TraderToId['Ragman'], //Facecover
        "5b3f15d486f77432d0509248" : this.TraderToId['Ragman'], //Armband
        "5448f3a64bdc2d60728b456a" : this.TraderToId['Therapist'], //Injectors
        "5448f3ac4bdc2dce718b4569" : this.TraderToId['Therapist'], //Injury Treatments
        "5448f39d4bdc2d0a728b4568" : this.TraderToId['Therapist'], //Medkit
        "5448f3a14bdc2d27728b4569" : this.TraderToId['Therapist'], //Pills
        "5448e8d04bdc2ddf718b4569" : this.TraderToId['Therapist'], //Food
        "5448e8d64bdc2dce718b4568" : this.TraderToId['Therapist'], //Drinks
        "543be5cb4bdc2deb348b4568" : this.TraderToId['Mechanic'], //Ammobox
        "5485a8684bdc2da71d8b4567" : this.TraderToId['Mechanic'], //Rounds
        "543be6564bdc2df4348b4568" : this.TraderToId['Mechanic'], //Throwable
        "5447e1d04bdc2dff2f8b4567" : this.TraderToId['Mechanic'], //Melee Weapons
        "5447bed64bdc2d97278b4568" : this.TraderToId['Mechanic'], //Machine Guns
        "5447b6254bdc2dc3278b4568" : this.TraderToId['Mechanic'], //SnipersRifles
        "5447b5e04bdc2d62278b4567" : this.TraderToId['Mechanic'], //Smgs
        "617f1ef5e8b54b0998387733" : this.TraderToId['Mechanic'], //Revolver
        "5447b6094bdc2dc3278b4567" : this.TraderToId['Mechanic'], //Shotguns
        "5447b5cf4bdc2d65278b4567" : this.TraderToId['Mechanic'], //Pistol
        "5447b6194bdc2d67278b4567" : this.TraderToId['Mechanic'], //MarksmanRifles
        "5447b5f14bdc2d61278b4567" : this.TraderToId['Mechanic'], //AssaultRifles
        "5447b5fc4bdc2d87278b4567" : this.TraderToId['Mechanic'], //AssaultCarbines
        "5a74651486f7744e73386dd1" : this.TraderToId['Mechanic'], //Auxiliary Parts
        "5448fe7a4bdc2d6f028b456b" : this.TraderToId['Mechanic'], //Sights
        "55818b0e4bdc2dde698b456e" : this.TraderToId['Mechanic'], //LightLasers
        "55818b164bdc2ddc698b456c" : this.TraderToId['Mechanic'], //TacticalCombo
        "55818b084bdc2d5b648b4571" : this.TraderToId['Mechanic'], //Flashlight
        "5448fe394bdc2d0d028b456c" : this.TraderToId['Mechanic'], //Muzzle
        "55818af64bdc2d5b648b4570" : this.TraderToId['Mechanic'], //Foregrip
        "55818afb4bdc2dde698b456d" : this.TraderToId['Mechanic'], //Bipods
        "55818a594bdc2db9688b456a" : this.TraderToId['Mechanic'], //Stock
        "55818b224bdc2dde698b456f" : this.TraderToId['Mechanic'], //Mounts
        "5448bc234bdc2d3c308b4569" : this.TraderToId['Mechanic'], //Magazines
        "55818b014bdc2ddc698b456b" : this.TraderToId['Mechanic'], //Launcher
        "5447bedf4bdc2d87278b4568" : this.TraderToId['Mechanic'], //GrenadeLauncher
        "55818a6f4bdc2db9688b456b" : this.TraderToId['Mechanic'], //Charging Handle
        "55818a304bdc2db5418b457d" : this.TraderToId['Mechanic'], //Receiver
        "55818a684bdc2ddd698b456d" : this.TraderToId['Mechanic'], //PistolGrip
        "56ea9461d2720b67698b456f" : this.TraderToId['Mechanic'], //Gasblock
        "55818a104bdc2db9688b4569" : this.TraderToId['Mechanic'], //Handguard
        "555ef6e44bdc2de9068b457e" : this.TraderToId['Mechanic'], //Barrel
        "5c164d2286f774194c5e69fa" : this.TraderToId['Therapist'], //Keycards
        "5c99f98d86f7745c314214b3" : this.TraderToId['Therapist'], //MechanicalKeys
        "5448ecbe4bdc2d60728b4568" : this.TraderToId['Peacekeeper'], //Info items
        "5447e0e74bdc2d3c308b4567" : this.TraderToId['Prapor'], //Special Equipments
        "567849dd4bdc2d150f8b456e" : this.TraderToId['Therapist'], //Maps
        "543be5dd4bdc2deb348b4569" : this.TraderToId['Peacekeeper'], //Money
        "566168634bdc2d144c8b456c" : this.TraderToId['Skier'] //SearchableItem
    }

    public isModded(id: string): boolean {
        // if it doesnt find anything it will be undefined, therefore its a modded item
        if(this.VanillaItems[id])
            return false;
        return true;
    }

    public returnParent(logger, tables: IDatabaseTables,tpl: string): string {
        if(this.ParentToTrader[tables.templates.items[tpl]._id])
            return this.ParentToTrader[tables.templates.items[tpl]._id];
        const childTpl = tables.templates.items[tpl]._parent;
        if(this.ParentToTrader[childTpl])
            return this.ParentToTrader[childTpl];
        else if(this.ParentToTrader[tables.templates.items[childTpl]._parent])
            return this.ParentToTrader[tables.templates.items[childTpl]._parent];
        else if(this.ParentToTrader[tables.templates.items[tables.templates.items[childTpl]._parent]._parent])
            return this.ParentToTrader[tables.templates.items[tables.templates.items[childTpl]._parent]._parent]; // gotta love big families
        else {
            // some items are nested within 3 parents until it reaches a common class (like NVGs or Thermals)
            // this exists in case there are even more or i forgot to add a class
            logger.warning("Unable to find the lost grandparent of this goober "+tables.templates.items[childTpl]._id);
            logger.warning("Report this to the mod author, meanwhile Mechanic will receive this item.");
            return this.TraderToId['Mechanic'];
        }
    }

    public preSptLoad(container: DependencyContainer): void {
        const hashUtil: HashUtil = container.resolve<HashUtil>("HashUtil");
        const logger = container.resolve<ILogger>("WinstonLogger");
        this.fluentAssortCreator = new FluentAssortCreator(hashUtil, logger);
    }

    public postDBLoad(container: DependencyContainer): void {
        const databaseServer = container.resolve<DatabaseServer>("DatabaseServer");
        const traderHelper: TraderHelper = container.resolve<TraderHelper>("TraderHelper");
        const logger = container.resolve<ILogger>("WinstonLogger");

        const tables: IDatabaseTables = databaseServer.getTables();
        const items = Object.values(tables.templates.items);
        const traders = Object.values(tables.traders);
        const tempModdedItemList = items.filter(x => this.isModded(x._id));
        const moddedItemList = [];

        for (const modItem in tempModdedItemList){
            moddedItemList.push(tempModdedItemList[modItem]._id);
        }

        logger.info("== Spring's Trader Assort Relocator ==");
        if (this.Config.debug){
            logger.info("== Debug settings are turned ON ==");
            logger.info("== They can be turned OFF in the config file ==");
        }
        for (const trader of traders){
            const traderId = trader.base._id;
            if (this.VanillaTraders.includes(traderId) || this.Config.Ignore.includes(traderId) || this.Config.Ignore.includes(trader.base.nickname))
                continue;
            logger.info("== Found the Trader '"+trader.base.nickname+"' and it's ID is '"+traderId+"' ==");
            logger.info("== The trader above isn't in the ignore list ==");
            logger.info("== Starting Transfer Process ==");
            
            const assorts = traderHelper.getTraderAssortsByTraderId(traderId);
            const offers = assorts.items;
            for (const offer of offers){
                const itemTpl = offer._tpl;
                const parentTpl = tables.templates.items[itemTpl]._parent;
                if (moddedItemList.includes(itemTpl) || !(this.Config.OnlyTransferCustomItems)){
                    if (this.Config.debug){
                        logger.info("Current Item = "+tables.templates.items[itemTpl]._name);
                        logger.info("Current ID = "+tables.templates.items[itemTpl]._id);
                    }
                    
                    const targetTraderInfo = this.returnParent(logger,tables,parentTpl);
                    const newOfferId = `${offer._id}_from_${trader.base.nickname}`;

                    // any item that is a mods on another item will have the item offer as their parentId
                    if (offer.parentId != 'hideout'){
                        const newChildAssort = offer;
                        const newParentId = `${offer.parentId}_from_${trader.base.nickname}`;
                        const childTpl = tables.templates.items[newChildAssort._tpl]._parent;
                        const newTargetTrader = this.returnParent(logger,tables,childTpl)
                        newChildAssort.parentId = newParentId;
                        newChildAssort._id = newOfferId;
                        tables.traders[newTargetTrader].assort.items.push(newChildAssort);
                        continue;
                    }

                    const barterInfo = assorts.barter_scheme[offer._id][0];
                    const loyaltyInfo = assorts.loyal_level_items[offer._id];
                    const countInfo = offer.upd.StackObjectsCount;
                    const traderInfo = tables.traders[targetTraderInfo];
                    if (this.Config.debug){
                        logger.info("barterInfo.length = "+barterInfo.length);
                        logger.info("loyaltyInfo       = "+loyaltyInfo);
                        logger.info("countInfo         = "+countInfo);
                        logger.info("traderInfo        = "+targetTraderInfo);
                    }

                    // my computer science teacher would bitch slap me for doing this
                    // but fuck it we ball
                    switch (barterInfo.length) {
                        case 1:
                            this.fluentAssortCreator
                                .createSingleAssortItem(itemTpl,newOfferId)
                                .addStackCount(countInfo)
                                .addLoyaltyLevel(loyaltyInfo)
                                .addBarterCost(barterInfo[0]._tpl, barterInfo[0].count)
                                .export(traderInfo);
                            break;
                        case 2:
                            this.fluentAssortCreator
                                .createSingleAssortItem(itemTpl,newOfferId)
                                .addStackCount(countInfo)
                                .addLoyaltyLevel(loyaltyInfo)
                                .addBarterCost(barterInfo[0]._tpl, barterInfo[0].count)
                                .addBarterCost(barterInfo[1]._tpl, barterInfo[1].count)
                                .export(traderInfo);
                            break;
                        case 3:
                            this.fluentAssortCreator
                                .createSingleAssortItem(itemTpl,newOfferId)
                                .addStackCount(countInfo)
                                .addLoyaltyLevel(loyaltyInfo)
                                .addBarterCost(barterInfo[0]._tpl, barterInfo[0].count)
                                .addBarterCost(barterInfo[1]._tpl, barterInfo[1].count)
                                .addBarterCost(barterInfo[2]._tpl, barterInfo[2].count)
                                .export(traderInfo);
                            break;
                        case 4:
                            this.fluentAssortCreator
                                .createSingleAssortItem(itemTpl,newOfferId)
                                .addStackCount(countInfo)
                                .addLoyaltyLevel(loyaltyInfo)
                                .addBarterCost(barterInfo[0]._tpl, barterInfo[0].count)
                                .addBarterCost(barterInfo[1]._tpl, barterInfo[1].count)
                                .addBarterCost(barterInfo[2]._tpl, barterInfo[2].count)
                                .addBarterCost(barterInfo[3]._tpl, barterInfo[3].count)
                                .export(traderInfo);
                            break;
                        case 5:
                            this.fluentAssortCreator
                                .createSingleAssortItem(itemTpl,newOfferId)
                                .addStackCount(countInfo)
                                .addLoyaltyLevel(loyaltyInfo)
                                .addBarterCost(barterInfo[0]._tpl, barterInfo[0].count)
                                .addBarterCost(barterInfo[1]._tpl, barterInfo[1].count)
                                .addBarterCost(barterInfo[2]._tpl, barterInfo[2].count)
                                .addBarterCost(barterInfo[3]._tpl, barterInfo[3].count)
                                .addBarterCost(barterInfo[4]._tpl, barterInfo[4].count)
                                .export(traderInfo);
                            break;
                        case 6:
                            this.fluentAssortCreator
                                .createSingleAssortItem(itemTpl,newOfferId)
                                .addStackCount(countInfo)
                                .addLoyaltyLevel(loyaltyInfo)
                                .addBarterCost(barterInfo[0]._tpl, barterInfo[0].count)
                                .addBarterCost(barterInfo[1]._tpl, barterInfo[1].count)
                                .addBarterCost(barterInfo[2]._tpl, barterInfo[2].count)
                                .addBarterCost(barterInfo[3]._tpl, barterInfo[3].count)
                                .addBarterCost(barterInfo[4]._tpl, barterInfo[4].count)
                                .addBarterCost(barterInfo[5]._tpl, barterInfo[5].count)
                                .export(traderInfo);
                            break;
                        case 7:
                            this.fluentAssortCreator
                                .createSingleAssortItem(itemTpl,newOfferId)
                                .addStackCount(countInfo)
                                .addLoyaltyLevel(loyaltyInfo)
                                .addBarterCost(barterInfo[0]._tpl, barterInfo[0].count)
                                .addBarterCost(barterInfo[1]._tpl, barterInfo[1].count)
                                .addBarterCost(barterInfo[2]._tpl, barterInfo[2].count)
                                .addBarterCost(barterInfo[3]._tpl, barterInfo[3].count)
                                .addBarterCost(barterInfo[4]._tpl, barterInfo[4].count)
                                .addBarterCost(barterInfo[5]._tpl, barterInfo[5].count)
                                .addBarterCost(barterInfo[6]._tpl, barterInfo[6].count)
                                .export(traderInfo);
                            break;
                        case 8:
                            this.fluentAssortCreator
                                .createSingleAssortItem(itemTpl,newOfferId)
                                .addStackCount(countInfo)
                                .addLoyaltyLevel(loyaltyInfo)
                                .addBarterCost(barterInfo[0]._tpl, barterInfo[0].count)
                                .addBarterCost(barterInfo[1]._tpl, barterInfo[1].count)
                                .addBarterCost(barterInfo[2]._tpl, barterInfo[2].count)
                                .addBarterCost(barterInfo[3]._tpl, barterInfo[3].count)
                                .addBarterCost(barterInfo[4]._tpl, barterInfo[4].count)
                                .addBarterCost(barterInfo[5]._tpl, barterInfo[5].count)
                                .addBarterCost(barterInfo[6]._tpl, barterInfo[6].count)
                                .addBarterCost(barterInfo[7]._tpl, barterInfo[7].count)
                                .export(traderInfo);
                            break;
                        case 9:
                            this.fluentAssortCreator
                                .createSingleAssortItem(itemTpl,newOfferId)
                                .addStackCount(countInfo)
                                .addLoyaltyLevel(loyaltyInfo)
                                .addBarterCost(barterInfo[0]._tpl, barterInfo[0].count)
                                .addBarterCost(barterInfo[1]._tpl, barterInfo[1].count)
                                .addBarterCost(barterInfo[2]._tpl, barterInfo[2].count)
                                .addBarterCost(barterInfo[3]._tpl, barterInfo[3].count)
                                .addBarterCost(barterInfo[4]._tpl, barterInfo[4].count)
                                .addBarterCost(barterInfo[5]._tpl, barterInfo[5].count)
                                .addBarterCost(barterInfo[6]._tpl, barterInfo[6].count)
                                .addBarterCost(barterInfo[7]._tpl, barterInfo[7].count)
                                .addBarterCost(barterInfo[8]._tpl, barterInfo[8].count)
                                .export(traderInfo);
                            break;
                        default:
                            logger.warning("== The item "+tables.templates.items[itemTpl]._id+" on the trader "+trader.base.nickname+" has a barter lenght of "+barterInfo.length+"! ==");
                            logger.warning("== I cant do switch cases till infinity ==");
                            logger.warning("== For the love of christ reduce the amount of items needed or show me a better way to do this ==");
                    }
                    if (this.Config.debug)
                        logger.info("Relocated the item "+tables.templates.items[itemTpl]._name+" from the trader "+trader.base.nickname);
                }
            }
            logger.info("== Removing Trader '"+trader.base.nickname+"' ==");
            tables.traders[traderId].base.availableInRaid = true;
            tables.traders[traderId].base.insurance.availability = false;
            tables.traders[traderId].base.repair.availability = false;
        }
        logger.info("== Finished Loading ==");
    }
}

export const mod = new Mod();
