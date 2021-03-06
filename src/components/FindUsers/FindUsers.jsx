import React from "react";
import Paginator from "../common/paginator/Paginator";
import User from "./User/User";


const FindUsers = (props) => {


    return (
        <div>

            <Paginator totalUsersCount={props.totalUsersCount}
                       pageSize={props.pageSize}
                       currentPage={props.currentPage}
                       onPageChanged={props.onPageChanged}/>

            {props.users.map(u =>
                <User key={u.id}
                      user={u}
                      followingProgress={props.followingProgress}
                      unfollowTC={props.unfollowTC}
                      followTC={props.followTC}/>
            )}

        </div>
    )
}
export default FindUsers