import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuctionService} from '../../services/auction.service';
import {Items} from '../../interfaces/items';
import {ActivatedRoute} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {User} from '../../interfaces/user';
import {interval} from 'rxjs';
import {startWith, switchMap, takeWhile} from 'rxjs/operators';

@Component({
  selector: 'app-view-auction',
  templateUrl: './view-auction.component.html',
  styleUrls: ['./view-auction.component.scss']
})
export class ViewAuctionComponent implements OnInit {

  item: Items;
  itemId: number;
  auctionForm: FormGroup;
  userAuction: any;
  message = '';
  status = false;
  statusClass = '';
  bidHistory: any;
  bidValue: number;
  timeLeft: any;
  itemOwner: User;
  takenData$: any;

  constructor(private auctionService: AuctionService, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(res => this.itemId = res.id); // get url params
    const updateTimer = interval(7000);
    this.takenData$ = updateTimer.pipe(
      takeWhile(value => value < 30),
      startWith(0),
      switchMap(
        () => this.auctionService.getById(this.itemId)
      )
    );
    this.getInitialValues();
  }

  private getInitialValues(): void {
    this.takenData$.subscribe(res => {
      this.item = res.item;
      this.bidHistory = res.history;
      this.timeLeft = res.time_left;
      this.bidValue = res.user_auction ? res.user_auction.bid + 1 : 1;
      this.itemOwner = res.item_owner;
      this.auctionForm = new FormGroup({
        bid: new FormControl(this.bidValue, [Validators.required, Validators.min(this.bidValue)])
      });
      if (!res.can_bid) {
        this.sendMessage(true, 'Your bid was the last one, please wait for another offer', 'danger');
        this.auctionForm.disable();
      } else {
        this.auctionForm.enable();
        this.sendMessage(false, 'Your bid was the last one, please wait for another offer', 'danger');
      }
      this.checkExpired();
    });
  }

  private checkExpired() {
    if (this.timeLeft[0] === 0 && this.timeLeft[1] === 0) {
      this.sendMessage(true, 'This auction is expired', 'danger');
      this.auctionForm.disable();
    }
  }

  saveBid() {
    const data = {bid: this.auctionForm.value.bid, item_id: this.itemId};
    this.auctionForm.disable();
    this.auctionService.saveBid(data).subscribe(
      res => {
        this.sendMessage(true, 'Your bid was saved and for now you can\'t make another one', 'success');
      },
      error => {
        this.sendMessage(true, 'There is an error with this request', 'danger');
        this.auctionForm.enable();

      });
  }

  private sendMessage(status, message, classType): void {
    this.status = status;
    this.message = message;
    this.statusClass = 'alert alert-' + classType + ' mt-2';
  }
}
