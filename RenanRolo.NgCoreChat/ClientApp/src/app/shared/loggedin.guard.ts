import { CanLoad, Route, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ChatService } from "../services/chat/chat.service";

@Injectable()
export class LoggedInGuard implements CanLoad, CanActivate {

    constructor(private chatService: ChatService) { }

    canLoad(route: Route): boolean {
        //route.path.includes("professor/")
        if (this.chatService.isLoged()) {
            return true;
        }
        this.chatService.handdleLogin();
    }

    canActivate(
        route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
            if (this.chatService.isLoged()) {
                return true;
            }
            this.chatService.handdleLogin();
    }
}